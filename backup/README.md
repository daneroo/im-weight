# Backups fo im-weight
We are now deployed on heroku

## Backups from http://im-weight.herokuapp.com/
This is just to grab the data every 4 hours, and have it saved in TimeMachine,...
We should allow for save/restore from the app....

    # crontab -e # on shannon
    03 */4 * * * cd /Users/daniel/Code/iMetrical/im-weight/backup; ./backup.sh >> error.log 2>&1

	03 */4 * * * cd /Users/daniel/Code/iMetrical/im-weight/backup; ./backup.sh >> error.log 2>&1

## Backups from im-w.cloudfoundry.com
These have been disabled, and the app removed

    # crontab -e # on dirac
    03 */4 * * * cd /Users/daniel/Sites/im-weight; ./backup.sh >> error.log 2>&1