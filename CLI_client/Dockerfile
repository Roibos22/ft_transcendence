FROM python:3.13-rc-alpine

RUN apk update

COPY files /run

WORKDIR /run

RUN pip install --no-cache-dir -r /run/requirements.txt

CMD ["sh", "-c", "while true; do sleep 1; done"]
