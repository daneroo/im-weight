# Managing s3 buckets for im-weight

## TODO

- make `keyrotation.sh` script

## S3 permission related operations

These key management operations are done using a more privileged user (im-dan)

### Setup

- Create user, access-key s3 policy, attach to user

```bash
./setup.sh
```

### Status

```bash
./status
```

### Rotating keys

Not yet done

### Teardown

- detach policy from user, delete policy, access key, user

```bash
./teardown.sh
```
