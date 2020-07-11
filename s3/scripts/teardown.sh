. ENV.sh

# set -e


policyArn=`aws iam list-policies --scope Local | jq -r ".Policies[]|select(.PolicyName==\"${POLICYNAME}\").Arn"`
echo
echo "Detach User Policy (${policyArn}) "
aws iam detach-user-policy --user-name ${USERNAME} --policy-arn ${policyArn}

echo
echo "Delete User Policy (${policyArn}) "
aws iam delete-policy --policy-arn ${policyArn}

echo
echo "Delete Access Key for ${USERNAME}"
keyId=`aws iam list-access-keys --user-name ${USERNAME} | jq -r .AccessKeyMetadata[].AccessKeyId`
aws iam delete-access-key --user-name ${USERNAME} --access-key-id ${keyId}

echo "Delete user ${USERNAME} (with profile ${AWS_PROFILE})"
aws iam delete-user --user-name ${USERNAME} 

echo "Done"