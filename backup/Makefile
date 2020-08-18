

all:
	@echo "im-weight backups.. check | head | resore"

check:
	aws --profile im-dan s3 cp s3://im-weight/observationdata.json - | md5sum
	curl -s https://im-weight.herokuapp.com/backup | md5sum
	cat observationdata.json | md5sum

head:
	aws --profile im-dan s3 cp s3://im-weight/observationdata.json - | jq .values[0]
	curl -s https://im-weight.herokuapp.com/backup | jq .values[0]
	cat observationdata.json | jq .values[0]

restore:
	@echo aws --profile im-dan s3 cp observationdata.json s3://im-weight/observationdata.json