# Backups fo im-weight
We are now deployed on heroku

## Backups from http://im-weight.herokuapp.com/
This is just to grab the data every hour, and have it saved in TimeMachine,...
We should allow for save/restore from the app....

    # crontab -e # on shannon
    03 */4 * * * cd Code/iMetrical/im-weight/backup; ./backup.sh >> error.log 2>&1

## Backups from im-w.cloudfoundry.com
This is just to grab the data every hour, and have it saved in TimeMachine,...
We should allow for save/restore from the app....

    # crontab -e # on dirac
    03 */4 * * * cd /Users/daniel/Sites/im-weight; ./backup.sh >> error.log 2>&1