<p align="center">
  <img width="320" height="318" src="https://user-images.githubusercontent.com/6170734/59278327-b0574c80-8c59-11e9-935a-3f556cb1571d.png">
</p>

# GSX-API Rest 


## Configuration
```
    To this Class work you will need capture the cookie from Apple Partner (myacinfo-uat). This cookie has a duration of 1 year. 
   
    var GSX = require('./index.js');
    gsx = new GSX(soldTo, shipTo, appleID, certFile, privateKeyWithNoPass, cookieFromApplePartner);

    You will need allways run getActivateToken() -> getLogin() -> fn you want; I will improve this situation to getlogin()-> fn you want;
```

<p align="center">
  <img width="710" height="110" src="https://user-images.githubusercontent.com/6170734/59277650-7df91f80-8c58-11e9-8874-9938b506a90e.PNG">
</p>


## Example 
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