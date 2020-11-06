ready(function() {

var rippleServerUrl = 'wss://s1.ripple.com/';
var offlineapi = new ripple.RippleAPI();
var onlineapi = new ripple.RippleAPI({server:rippleServerUrl});

//console.log("views");

  var app = new Vue({
          el: '#app',
          data(){
            return {
              submitOnly: false,
              signed: "",
              address: "",
              secret: "",
              ethaddress: "",
              message: "",
              server: {},
              onlineapi : onlineapi,
              offlineapi: offlineapi,
              twentyfour_zeros: this.getZeros(),
              messages : [],
              newaddress: {},
              rippleServerUrl : rippleServerUrl,
              click: (buttonName,$event) => {
                var self = this;
                this.sign();

              }//close click

            }//close return

          },//close data
          methods: {
            sign: function(){

              var self = this;
              //console.log(this.signed);
              xrpaddress = this.address;

              const tx = {
                "TransactionType":"AccountSet",
                "Account": xrpaddress,
                "Fee":"12",
                //"Sequence":23,
                "SetFlag": 5,
                "MessageKey": this.message
              };
              // the only thing done through the online api is get the Sequence
              self.onlineapi.connect().then(function() {

                self.messages.push("connecting with: " + self.rippleServerUrl);
                self.onlineapi.prepareTransaction(tx).then(function(res) {
                  self.messages.push("getting necessary transaction info...");
                  tx.Sequence = res.instructions.sequence;
                  //console.log(res);
                  self.messages.push("Preparing to sign with offline api...");
                  const txJSON = JSON.stringify(tx);
                  //console.log(txJSON);
                  const secret = self.secret;
                  const signed = self.offlineapi.sign(txJSON, secret);
                  self.signed = JSON.stringify(signed);
                  //console.log(signed);
                  self.messages.push("Removing secret from form...");
                  self.secret = "";
                });
                //console.log(tx);


              });//close then


            },
            sendTx: async function(){
              var self = this;
              self.onlineapi.connect().then(function() {

              (async function(){

                var txObj = JSON.parse(self.signed);

                try {
                  let result = await onlineapi.submit(txObj.signedTransaction);
                  if(typeof(result) !== "undefined"){
                    self.messages.push(result);
                    console.log(result);
                    if(self.address == ""){
                      var address = "<youraddress>";
                    }
                    else{
                      var address = self.address;
                    }
                    self.messages.push("Check your account here: " + "https://xrpscan.com/account/" + address );
                  }
                } catch (submitError) {
                  console.log("Submit Error");
                  console.log(submitError);
                  self.messages.push(submitError);
                }


              })();


              });//close then

            },
            getZeros(){
              var twentyfour_zeros = "";
              for(var i = 0;i < 24;i++){
                twentyfour_zeros += "0";
              }
              return twentyfour_zeros;
            },
            setServerInfo(){


              this.onlineapi.connect().then(function() {
                  return this.onlineapi.getServerInfo();
              }).then(function(server_info) {
                console.log(server_info);

              this.server['buildVersion'] = server_info.buildVersion;
              this.server['completeLedgers'] = server_info.completeLedgers;
              this.server['hostID'] = server_info.hostID;
              this.server['ledgerVersion'] = server_info.validatedLedger.ledgerVersion;
              this.server['hash'] = server_info.validatedLedger.hash;
              this.server['age'] = server_info.validatedLedger.age;


              });
            },
            toggle(btnName,event){
              if(btnName == "submit"){
                this.submitOnly = !this.submitOnly;

                this.toggleLabel = "Show sign form";
              }
              if(btnName == "create"){
                this.createAddress();
              }
            },
            createAddress(){
              var self = this;
              var newaddress = self.offlineapi.generateAddress();
              //console.log(newaddress);
              self.newaddress = newaddress;
            }

          },
          watch: {
            ethaddress: function (val,oldVal) {
              console.log(val);
              console.log(oldVal);
              var ethPubKey = val;
              var prefix_stripped = ethPubKey.slice(2);
              var uppercase_stripped = prefix_stripped.toUpperCase();
              var message = "02" + this.twentyfour_zeros + uppercase_stripped;
              //console.log(message);

              this.message = message;
            },
            messages: function (val,oldVal) {
              //wait
              this.$emit('clear-messages');
            }
          },
          mounted: function () {

            let timer;
            this.$on('clear-messages', timeOutMsArg => {
              if(timeOutMsArg){
                var timeOutMs = timeOutMsArg;
              }else{
                var timeOutMs = 5000;
              }
              clearTimeout(timer);
              timer = setTimeout(() => {
                if(this.messages.length > 1){
                  this.messages.pop();
                }else{
                  this.messages = [];
                }

              }, timeOutMs)
            });
          },

  });//close Vue


});//close ready
