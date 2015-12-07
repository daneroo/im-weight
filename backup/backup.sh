#!/bin/sh

# ** Do not put the LOGGLY TOKEN in version control...
# source as env variable $LOGGLY_TOKEN
. ENV.sh
SOURCE="im-weight.herokuapp.com"
SOURCE_URI="http://${SOURCE}/backup"
DESTINATION="`hostname`"

# Get the backup data
curl -s ${SOURCE_URI} > observationdata.json
# full path for md5sum because /usr/local/bin not in cron's path
MD5=`/usr/local/bin/md5sum observationdata.json|cut -d ' '  -f 1`
LATEST=`grep stamp observationdata.json |head -1|cut -d '"' -f 4`
echo "Backed up im-weight on ${DESTINATION}@" `date "+%Y-%m-%dT%H:%M:%S"` "SOURCE: ${SOURCE} md5: ${MD5} latest: ${LATEST}"

TAGS="im-weight,host-${DESTINATION}"
LOGGLY_URL="http://logs-01.loggly.com/inputs/${LOGGLY_TOKEN}/tag/${TAGS}"
RESPONSE=$(curl -s -H "content-type:text/plain" -d "{ \"message\" : \"Backed up im-weight\", \"md5\":\"${MD5}\", \"latest\":\"${LATEST}\", \"source\":\"${SOURCE}\", \"destination\":\"${DESTINATION}\" }" ${LOGGLY_URL})
echo "Sent to Loggly ${RESPONSE}"