# hhru-updater

> Update automatically your resume on https://hh.ru/

## Install

```
$ git clone https://github.com/abstractmagicalwand/hhru-updater.git
$ cd hhru-updater
$ yarn install
```

## Usage

Open `config/default.json` and need to complete fields:
```json
{
  "url": {
    "main": "https://hh.ru/",
    "resume": "<your_resume>"
  },
  "password": "<your_password>",
  "email": "<your_email>",
```

Run:
```sh
$ yarn start
```

## License

MIT © abstractmagicalwand