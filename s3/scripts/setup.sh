. ENV.sh

set -e
echo 
echo "Creating user ${USERNAME} (with profile ${AWS_PROFILE})"
aws iam create-user --user-name ${USERNAME} 

echo 
echo "Creating access key"
aws iam create-access-key --user-name ${USERNAME} |jq .AccessKey >../s3-creds.json

echo 
echo "Creating access policy"
aws iam create-policy --policy-name ${POLICYNAME} --policy-document file://${POLICYNAME}.json

policyArn=`aws iam list-policies --scope Local | jq -r ".Policies[]|select(.PolicyName==\"${POLICYNAME}\").Arn"`
echo
echo "Attaching User Policy (${policyArn})"
aws iam attach-user-policy --user-name ${USERNAME} --policy-arn ${policyArn}

echo
echo "Done"
