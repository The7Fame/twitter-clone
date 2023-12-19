FROM python:3.9

RUN mkdir -p backend/{media,log}
COPY . /backend

RUN pip3 install -r /backend/requirements.txt
WORKDIR /backend

EXPOSE 8000

CMD python create_db.py && uvicorn main:app --host 0.0.0.0 --port 8000 --log-config log.ini