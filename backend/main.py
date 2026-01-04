import os
import time
from typing import List, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import requests

load_dotenv()

app = FastAPI(title="BuscaVagas API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SearchParams(BaseModel):
    query: str
    location: str

class Job(BaseModel):
    id: str
    title: str
    company: str
    companyLogo: str
    location: str
    type: str
    modality: str
    level: str
    salary: Optional[str] = None
    description: str
    requirements: List[str]
    benefits: List[str]
    postedAt: str
    source: str
    applicationUrl: str
    isUrgent: bool = False
    isFeatured: bool = False
    isSimplified: bool = False

@app.post("/api/search-jobs")
async def search_jobs(params: SearchParams):
    serpapi_key = os.getenv("SERPAPI_KEY")
    if not serpapi_key:
        raise HTTPException(status_code=500, detail="SERPAPI_KEY not configured")

    search_query = params.query.strip()
    if not search_query:
        if params.location:
            search_query = f"vagas de emprego {params.location}"
        else:
            search_query = "vagas de emprego Brasil"
    elif params.location:
        search_query = f"{search_query} {params.location}"

    serp_params = {
        "engine": "google_jobs",
        "q": search_query,
        "hl": "pt-br",
        "gl": "br",
        "api_key": serpapi_key
    }
    
    if params.location:
        serp_params["location"] = params.location

    try:
        response = requests.get("https://serpapi.com/search.json", params=serp_params)
        response.raise_for_status()
        data = response.json()
        
        job_results = data.get("jobs_results", [])
        transformed_jobs = []
        
        for index, job in enumerate(job_results):
            desc = job.get("description", "").lower()
            
            # Simple heuristics for job details
            job_type = "CLT"
            if "pj" in desc or "pessoa jurídica" in desc: job_type = "PJ"
            elif "estágio" in desc or "estagiário" in desc: job_type = "Estágio"
            
            modality = "Presencial"
            if any(term in desc for term in ["remoto", "home office", "trabalho remoto"]): modality = "Remoto"
            elif "híbrido" in desc: modality = "Híbrido"
            
            level = "Pleno"
            if any(term in desc for term in ["júnior", "junior", "jr"]): level = "Júnior"
            elif any(term in desc for term in ["sênior", "senior", "sr"]): level = "Sênior"

            transformed_jobs.append({
                "id": f"py-{index}-{int(time.time())}",
                "title": job.get("title", "Vaga sem título"),
                "company": job.get("company_name", "Empresa não informada"),
                "companyLogo": job.get("thumbnail") or f"https://ui-avatars.com/api/?name={job.get('company_name', 'E')[:2]}&background=random",
                "location": job.get("location", "Brasil"),
                "type": job_type,
                "modality": modality,
                "level": level,
                "salary": None,  # Extraction logic could be improved
                "description": job.get("description", ""),
                "requirements": job.get("detected_extensions", {}).get("qualifications", []),
                "benefits": [],
                "postedAt": job.get("detected_extensions", {}).get("posted_at", "Recent"),
                "source": job.get("via", "Google Jobs").replace("via ", ""),
                "applicationUrl": job.get("apply_options", [{}])[0].get("link", "#"),
                "isUrgent": "urgente" in desc,
                "isFeatured": index < 3,
                "isSimplified": "simplified" in desc
            })
            
        return {"jobs": transformed_jobs}
        
    except Exception as e:
        print(f"Error calling SerpApi: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
