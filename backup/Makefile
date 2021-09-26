

all: check head
	@echo
	@echo "im-weight backups.. make check | head | pushS3"

check:
	@echo
	@echo "-=-= Check digests(md5): GitHub Action, s3, vercel, vercel?digest, heroku, local-file"
	@echo "GitHub Action:   $(shell curl -s https://raw.githubusercontent.com/daneroo/scrobble-weight-data/main/observationdata.json | md5sum)"
	@echo "s3:              $(shell aws --profile im-dan s3 cp s3://im-weight/observationdata.json - | md5sum)"
	@echo "vercel:          $(shell curl -s https://weight.v.imetrical.com/api/observations | md5sum)"
	@echo "vercel?digest:   $(shell curl -s 'https://weight.v.imetrical.com/api/observations?digest' | jq -r .ETag)"
	@echo "heroku:          $(shell curl -s https://im-weight.herokuapp.com/backup | md5sum)"
	@echo "local-file cron: $(shell cat observationdata.json | md5sum)"

head:
	@echo
	@echo "-=-= Head (1st entry): GitHub Action, s3, vercel, heroku, local-file"
	@echo "GitHub Action:   $(shell curl -s https://raw.githubusercontent.com/daneroo/scrobble-weight-data/main/observationdata.json | jq .values[0])"
	@echo "s3:              $(shell aws --profile im-dan s3 cp s3://im-weight/observationdata.json - | jq .values[0])"
	@echo "vercel:          $(shell curl -s https://weight.v.imetrical.com/api/observations | jq .values[0])"
	@echo "heroku:          $(shell curl -s https://im-weight.herokuapp.com/backup | jq .values[0])"
	@echo "local-file cron: $(shell cat observationdata.json | jq .values[0])"

pushS3:
	@echo aws --profile im-dan s3 cp observationdata.json s3://im-weight/observationdata.json