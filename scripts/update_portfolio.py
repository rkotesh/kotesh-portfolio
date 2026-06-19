import os
import re
import json
import urllib.request
import urllib.error

# Config
GITHUB_USER = "rkotesh"
REPO_NAME = "kotesh-portfolio"
HTML_PATH = "index.html"
JS_PATH = "script.js"

def fetch_json(url, token=None):
    req = urllib.request.Request(url)
    req.add_header("User-Agent", "Mozilla/5.0")
    if token:
        req.add_header("Authorization", f"token {token}")
    try:
        with urllib.request.urlopen(req) as response:
            return json.loads(response.read().decode())
    except urllib.error.HTTPError as e:
        print(f"HTTP Error fetching {url}: {e.code} - {e.reason}")
        return None
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return None

def close_github_issue(issue_number, token):
    url = f"https://api.github.com/repos/{GITHUB_USER}/{REPO_NAME}/issues/{issue_number}"
    data = json.dumps({"state": "closed"}).encode("utf-8")
    req = urllib.request.Request(url, data=data, method="PATCH")
    req.add_header("User-Agent", "Mozilla/5.0")
    req.add_header("Authorization", f"token {token}")
    req.add_header("Content-Type", "application/json")
    try:
        with urllib.request.urlopen(req) as response:
            print(f"Successfully closed issue #{issue_number}")
    except Exception as e:
        print(f"Failed to close issue #{issue_number}: {e}")

def get_gemini_summary(prompt, api_key):
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
    data = json.dumps({
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"responseMimeType": "application/json"}
    }).encode("utf-8")
    req = urllib.request.Request(url, data=data, method="POST")
    req.add_header("Content-Type", "application/json")
    try:
        with urllib.request.urlopen(req) as response:
            res = json.loads(response.read().decode())
            text = res["candidates"][0]["content"]["parts"][0]["text"]
            return json.loads(text)
    except Exception as e:
        print(f"Gemini API generation failed, falling back to local parsing: {e}")
        return None

def make_project_metadata(repo, gemini_api_key):
    name = repo.get("name", "")
    description = repo.get("description") or ""
    language = repo.get("language") or "Python"
    html_url = repo.get("html_url", "")
    
    title = name.replace("_", " ").replace("-", " ").title()
    
    if gemini_api_key:
        prompt = f"""
        Analyze the GitHub repository name '{name}' and description '{description}'.
        Generate a professional title, summary description (1-2 sentences), tags (2-4 languages/tools), and 3-4 bullet-point highlights.
        Return the result as a raw JSON object with the keys: "title", "description", "tags" (array of strings), and "highlights" (array of strings).
        Do not wrap in markdown code blocks. Just return the JSON object.
        """
        data = get_gemini_summary(prompt, gemini_api_key)
        if data:
            return {
                "id": name.lower().replace("-", "_"),
                "title": data.get("title", title),
                "tags": data.get("tags", [language]),
                "description": data.get("description", description or f"A repository for {title}."),
                "highlights": data.get("highlights", ["Developed code architecture and logic.", "Used Git version control.", f"Implemented using {language}."]),
                "github": html_url
            }
            
    # Fallback template
    return {
        "id": name.lower().replace("-", "_"),
        "title": title,
        "tags": [language, "Utility"] if language else ["Software"],
        "description": description or f"An open-source repository for {title} built to solve development challenges.",
        "highlights": [
            "Implemented robust application structures.",
            "Fully configured for easy deployment and local testing.",
            f"Built using {language or 'modern language standards'}."
        ],
        "github": html_url
    }

def parse_experience_issue(body, gemini_api_key):
    # Parse key values
    # Expected format in issue body:
    # Role: Coordinator
    # Company: Techno Future
    # Period: May 2026 - Present
    # Location: Guntur, AP
    # Details: mentoring students, MERN...
    # Tags: MERN Stack, Leadership
    data = {}
    for line in body.split("\n"):
        if ":" in line:
            parts = line.split(":", 1)
            key = parts[0].strip().lower()
            val = parts[1].strip()
            if key in ["role", "company", "period", "location", "details", "tags"]:
                data[key] = val
                
    role = data.get("role", "Professional Role")
    company = data.get("company", "Company Name")
    period = data.get("period", "Current")
    location = data.get("location", "Remote")
    details = data.get("details", "")
    tags = [t.strip() for t in data.get("tags", "").split(",") if t.strip()] or ["Web Development"]
    
    if not details and gemini_api_key:
        prompt = f"""
        Based on this experience details: Role: {role}, Company: {company}, Details: {body}.
        Generate a professional bullet point descriptions for this work experience.
        Return the result as a raw JSON object with the keys "descriptions" (array of strings) and "tags" (array of strings).
        """
        ai_data = get_gemini_summary(prompt, gemini_api_key)
        if ai_data:
            details_paragraphs = "".join([f"<p>{p}</p>" for p in ai_data.get("descriptions", [])])
            return role, company, period, location, details_paragraphs, ai_data.get("tags", tags)
            
    # Fallback parsing
    if details:
        details_paragraphs = "".join([f"<p>{p.strip()}</p>" for p in details.split("\n\n") if p.strip()])
    else:
        details_paragraphs = f"<p>Accomplished responsibilities as a {role} at {company}. Helped streamline processes, collaborating with team members and delivering quality output.</p>"
        
    return role, company, period, location, details_paragraphs, tags

def parse_education_issue(body):
    data = {}
    for line in body.split("\n"):
        if ":" in line:
            parts = line.split(":", 1)
            key = parts[0].strip().lower()
            val = parts[1].strip()
            if key in ["institution", "period", "degree", "details", "tags"]:
                data[key] = val
                
    institution = data.get("institution", "Institution")
    period = data.get("period", "2026")
    degree = data.get("degree", "Certification / Degree")
    details = data.get("details", "Professional certification program.")
    tags = [t.strip() for t in data.get("tags", "").split(",") if t.strip()] or ["Certification"]
    
    return institution, period, degree, details, tags

def update_files():
    github_token = os.environ.get("GITHUB_TOKEN")
    gemini_api_key = os.environ.get("GEMINI_API_KEY")
    
    # Read files
    with open(HTML_PATH, "r", encoding="utf-8") as f:
        html_content = f.read()
    with open(JS_PATH, "r", encoding="utf-8") as f:
        js_content = f.read()
        
    # Track changes
    updated = False
    
    # 1. Update Projects from GitHub API
    print("Fetching GitHub Repositories...")
    repos = fetch_json(f"https://api.github.com/users/{GITHUB_USER}/repos", token=github_token)
    if repos:
        # Scan current repositories
        existing_repos = set(re.findall(r'github\.com/rkotesh/([^/"\s]+)', html_content))
        existing_repos.update(re.findall(r'github\.com/rkotesh/([^/"\s]+)', js_content))
        
        # Filter ignore lists (like portfolio itself)
        ignore_repos = {"kotesh-portfolio", "rkotesh", "rolla-ai"}
        
        new_projects_data = []
        for r in repos:
            name = r.get("name", "")
            if name not in existing_repos and name not in ignore_repos:
                print(f"Found new repository: {name}")
                proj = make_project_metadata(r, gemini_api_key)
                new_projects_data.append(proj)
                
        # Inject new projects
        for p in new_projects_data:
            print(f"Injecting project: {p['title']}")
            # HTML Card
            tags_html = "".join([f"                    <span>{t}</span>\n" for t in p["tags"]]).rstrip()
            html_card = f"""        <div class="project-card reveal-item" data-project="{p['id']}">
            <div class="project-info">
                <h4>{p['title']}</h4>
                <p>{p['description']}</p>
                <div class="project-tags">
{tags_html}
                </div>
                <div class="project-links">
                    <a href="{p['github']}" target="_blank" class="project-link">GitHub ↗</a>
                </div>
            </div>
        </div>
        """
            html_content = html_content.replace(
                "        <!-- AUTO_PROJECTS_MARKER -->",
                f"{html_card}\n        <!-- AUTO_PROJECTS_MARKER -->"
            )
            
            # JS projectDb entry
            highlights_js = ",\n".join([f'                "{h}"' for h in p["highlights"]])
            tags_js = ", ".join([f'"{t}"' for t in p["tags"]])
            js_db_entry = f"""        {p['id']}: {{
            title: "{p['title']}",
            tags: [{tags_js}],
            description: "{p['description']}",
            highlights: [
{highlights_js}
            ],
            liveLink: "",
            githubLink: "{p['github']}"
        }},
        """
            js_content = js_content.replace(
                "        /* AUTO_PROJECT_DB_MARKER */",
                f"{js_db_entry}\n        /* AUTO_PROJECT_DB_MARKER */"
            )
            
            # JS chatbot entry
            tech_js = ", ".join([f"'{t}'" for t in p["tags"]])
            js_chat_entry = f"""                {{
                    id: '{p['id']}',
                    title: '{p['title']}',
                    tech: [{tech_js}],
                    description: '{p['description']}',
                    github: '{p['github']}'
                }},
                """
            js_content = js_content.replace(
                "                /* AUTO_CHATBOT_PROJECTS_MARKER */",
                f"{js_chat_entry}\n                /* AUTO_CHATBOT_PROJECTS_MARKER */"
            )
            updated = True

    # 2. Update Experience/Education from GitHub Issues (LinkedIn updates CMS)
    if github_token:
        print("Fetching labeled CMS Issues...")
        issues = fetch_json(f"https://api.github.com/repos/{GITHUB_USER}/{REPO_NAME}/issues?labels=portfolio-update&state=open", token=github_token)
        if issues:
            for issue in issues:
                title = issue.get("title", "")
                body = issue.get("body", "") or ""
                labels = [l.get("name") for l in issue.get("labels", [])]
                issue_number = issue.get("number")
                
                print(f"Processing issue #{issue_number}: {title}")
                
                if "experience" in title.lower() or "job" in title.lower() or "internship" in title.lower():
                    # Parse Experience Update
                    role, company, period, location, details, tags = parse_experience_issue(body, gemini_api_key)
                    
                    # HTML Card
                    tags_html = "".join([f"                    <span>{t}</span>\n" for t in tags]).rstrip()
                    html_card = f"""        <div class="experience-card reveal-item">
            <div class="experience-meta">
                <span class="company">{company}</span>
                {period}
            </div>
            <div class="experience-body">
                <h4>{role}</h4>
                {details}
                <div class="experience-tags">
{tags_html}
                </div>
            </div>
        </div>
        """
                    html_content = html_content.replace(
                        "        <!-- AUTO_EXPERIENCE_MARKER -->",
                        f"        <!-- AUTO_EXPERIENCE_MARKER -->\n{html_card}"
                    )
                    
                    # Chatbot experiences array update
                    # Extract single sentence details for chatbot
                    clean_text = re.sub('<[^<]+?>', '', details).replace("\n", " ").strip()
                    chatbot_entry = f"""                {{
                    role: '{role}',
                    company: '{company}',
                    period: '{period}',
                    location: '{location}',
                    details: '{clean_text}'
                }},
                """
                    js_content = js_content.replace(
                        "                /* AUTO_CHATBOT_EXPERIENCES_MARKER */",
                        f"                /* AUTO_CHATBOT_EXPERIENCES_MARKER */\n{chatbot_entry}"
                    )
                    updated = True
                    close_github_issue(issue_number, github_token)
                    
                elif "education" in title.lower() or "certificate" in title.lower() or "certification" in title.lower():
                    # Parse Education Update
                    institution, period, degree, details, tags = parse_education_issue(body)
                    
                    # HTML Card
                    tags_html = "".join([f"                    <span>{t}</span>\n" for t in tags]).rstrip()
                    html_card = f"""        <div class="education-card reveal-item">
            <div class="education-meta">
                <span class="institution">{institution}</span>
                {period}
            </div>
            <div class="education-body">
                <h4>{degree}</h4>
                <p>{details}</p>
                <div class="education-tags">
{tags_html}
                </div>
            </div>
        </div>
        """
                    html_content = html_content.replace(
                        "        <!-- AUTO_EDUCATION_MARKER -->",
                        f"        <!-- AUTO_EDUCATION_MARKER -->\n{html_card}"
                    )
                    updated = True
                    close_github_issue(issue_number, github_token)

    if updated:
        with open(HTML_PATH, "w", encoding="utf-8") as f:
            f.write(html_content)
        with open(JS_PATH, "w", encoding="utf-8") as f:
            f.write(js_content)
        print("Portfolio files updated successfully!")
    else:
        print("No new updates found.")

if __name__ == "__main__":
    update_files()
