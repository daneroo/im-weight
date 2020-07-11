. ENV.sh

set -e
echo 
echo "Status"

echo
echo User details
aws iam list-users | jq ".Users[] | select(.UserName==\"${USERNAME}\")"
# aws iam get-user --user-name ${USERNAME} 

echo
echo Access keys

aws iam list-access-keys --user-name ${USERNAME}

echo
echo Key Last Used
keyId=`aws iam list-access-keys --user-name ${USERNAME} | jq -r .AccessKeyMetadata[].AccessKeyId`

aws iam get-access-key-last-used --access-key-id ${keyId}

echo
echo Show Policy
aws iam list-policies --scope Local | jq ".Policies[]|select(.PolicyName==\"${POLICYNAME}\")"

echo
echo  List attached policies
aws iam list-attached-user-policies --user-name ${USERNAME}

echo "Done"