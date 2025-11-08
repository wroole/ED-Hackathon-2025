from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from chatbot import question_sql_answer, detect_graph_request
from facts import generate_fact

app = FastAPI()
app.mount("/static", StaticFiles(directory='static'), name="static")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Question(BaseModel):
    question: str
    chart: bool | None = None

class Answer(BaseModel):
    sql: str
    result: list
    answer: str
    image: str | None = None

class FactResponse(BaseModel):
    fact: str

@app.post("/ask", response_model=Answer)
def ask(q: Question):
    need_chart = (q.chart is True) or (q.chart is None and detect_graph_request(q.question))
    out = question_sql_answer(q.question, need_chart)
    safe_result = out['result'] if isinstance(out['result'], list) else [out['result']]
    answer = Answer(sql=out['query'], result=safe_result, answer=out['answer'])
    if(out['image'] != None):
        answer.image = out['image']
    return answer

@app.get("/fact", response_model=FactResponse)
def fact():
    return FactResponse(fact=generate_fact())