![number-13](https://user-images.githubusercontent.com/6170734/59278327-b0574c80-8c59-11e9-935a-3f556cb1571d.png)

# GSX-API Rest 


# Configuration
```
    To this Class work you will need capture the cookie from Apple Partner (myacinfo-uat);
    ![Capturar](https://user-images.githubusercontent.com/6170734/59277650-7df91f80-8c58-11e9-8874-9938b506a90e.PNG)

    var GSX = require('./index.js');
    gsx = new GSX(soldTo, shipTo, appleID, certFile, privateKeyWithNoPass, cookieFromApplePartner);

    You will need allways run getActivateToken() -> getLogin() -> fn you want; I will improve this situation to getlogin()-> fn you want;
```

#Example 
```
    var GSX = require('./index.js');
    gsx = new GSX(soldTo, shipTo, appleID, certFile, privateKeyWithNoPass, cookieFromApplePartner);

    gsx.getActivateToken()
    .then(function () {
        return gsx.login();
    })
    .then(function (data) {
        console.log('[authCode] statusCode: ', data.statusCode);
        console.log('[authCode] authCode: ', data.body.authToken);

        /* change shipToYouWant */
        return gsx.repairSummary({
            shipTo: shipToYouWant
        })
    })
    .then(function (data) {
        console.log('[Repair Summary] statusCode: ', data.statusCode);
        console.log('[Repair Summary] body length: ', data.body.totalNumberOfRecords);

        /* change or init the var repairID */
        return gsx.repairDetails(repairID)
    })
    .catch(function(err){
        console.log(err);
    });

```