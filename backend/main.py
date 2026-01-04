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

# Configuração de CORS para aceitar requisições do seu domínio Netlify
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

@app.get("/")
async def health_check():
    return {"status": "online", "server_time": int(time.time())}

@app.post("/api/search-jobs")
async def search_jobs(params: SearchParams):
    serpapi_key = os.getenv("SERPAPI_KEY")
    if not serpapi_key:
        raise HTTPException(status_code=500, detail="SERPAPI_KEY não configurada")

    query_term = params.query.strip()
    location_term = params.location.strip()
    
    # ESTRATÉGIA PARA MAIS RESULTADOS:
    # Misturamos a cidade no termo principal 'q' para garantir que o Google
    # entenda o contexto local, ignorando que o servidor está nos EUA.
    if query_term and location_term:
        final_q = f"{query_term} em {location_term}"
    else:
        final_q = query_term or "vagas de emprego"

    serp_params = {
        "engine": "google_jobs",
        "q": final_q,
        "hl": "pt-br", # Idioma em Português
        "gl": "br",    # Resultados do Brasil
        "api_key": serpapi_key
    }
    
    # Também passamos a localização como parâmetro oficial
    if location_term:
        serp_params["location"] = location_term

    print(f"Buscando: '{final_q}' | Local: '{location_term}'")

    try:
        response = requests.get("https://serpapi.com/search.json", params=serp_params, timeout=15)
        response.raise_for_status()
        data = response.json()
        
        job_results = data.get("jobs_results", [])
        print(f"Sucesso: {len(job_results)} vagas encontradas.")

        transformed_jobs = []
        for index, job in enumerate(job_results):
            desc = job.get("description", "").lower()
            
            # Heurísticas básicas para preencher os cards
            job_type = "CLT"
            if any(t in desc for t in ["pj", "pessoa jurídica", "mei"]): job_type = "PJ"
            elif any(t in desc for t in ["estágio", "estagiário"]): job_type = "Estágio"
            
            modality = "Presencial"
            if any(t in desc for t in ["remoto", "home office", "trabalho remoto"]): modality = "Remoto"
            elif "híbrido" in desc: modality = "Híbrido"

            transformed_jobs.append({
                "id": f"real-{index}-{int(time.time())}",
                "title": job.get("title", "Vaga"),
                "company": job.get("company_name", "Confidencial"),
                "companyLogo": job.get("thumbnail") or f"https://ui-avatars.com/api/?name={job.get('company_name', 'V')[:2]}&background=random",
                "location": job.get("location", location_term or "Brasil"),
                "type": job_type,
                "modality": modality,
                "level": "Pleno",
                "salary": job.get("salary"),
                "description": job.get("description", ""),
                "requirements": job.get("detected_extensions", {}).get("qualifications", []),
                "benefits": [],
                "postedAt": job.get("detected_extensions", {}).get("posted_at", "Recente"),
                "source": job.get("via", "Google").replace("via ", ""),
                "applicationUrl": job.get("apply_options", [{}])[0].get("link", "#"),
                "isUrgent": "urgente" in desc,
                "isFeatured": index < 2
            })
            
        return {"jobs": transformed_jobs}
        
    except Exception as e:
        print(f"Erro SerpApi: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao buscar vagas reais")

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
    
