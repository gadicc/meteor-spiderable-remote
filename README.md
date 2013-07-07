

== In your Meteor project ==



== Deployment on Remote Host ==

The basic jist is this:

```bash
socat TCP-LISTEN:40,reuseaddr,fork,crlf exec:phantomjs
```

**Obviously** you should take additional precautions, such as:

1. Running in a chroot jail
2. Firewall the port and allow only from known IPs