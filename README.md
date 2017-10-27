# Kashflow CLI

```
npm install kashflow-cli -g
```

### Example Usage

```
# Auth is passed through environment variables
export KASHFLOW_USERNAME=<your username>
export KASHFLOW_PASSWORD=<your password>

kf get invoices
```

For more help in using the command line interface run:
```
kf --help
```

### Why did you write this?

After finding we had some inconsistent data in our accounts caused by a Kashflow bug, we wanted a way to easily export all our data in a scriptable form. This let us write some validation scripts so we could detect accounting inconsistencies in the future.

### License

MIT License
