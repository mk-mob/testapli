import { observable, computed, action, decorate, runInAction } from "mobx";
import { get, set, entries, remove } from "mobx";
import * as firebaseService from "./firebaseService";

export class Store {
  constructor() {
    this.activeUser = null;
    this.loading = false;
    this.authCheckComplete = false;
    this.items = new Map();
    this.scores = new Map();
    this.initializationError = null;
    this.shooting_point =20;

    this.initializeStore().then((u) => {
      this.activeUser = u;
      this.authCheckComplete = true;
    });
  }

  /**
   * if we have an authenticated user then get all of the profile
   * information from the database and associate it with the active
   * user
   * @param {*} _authUser
   */
  handleAuthedUser = async (_authUser) => {
    if (_authUser) {
      let userAcctInfo = await firebaseService.getUserProfile();
      console.log("setting active user");
      this.activeUser = { ..._authUser, ...userAcctInfo };

      await this.loadData("items");
    } else {
      this.activeUser = _authUser;
    }
    return this.activeUser;
  };

  /**
   * check to see if we have a user before starting up
   */
  async initializeStore() {
    return firebaseService
      .authCheck(this.handleAuthedUser)
      .then((_user) => {
        return _user;
      })
      .catch((e) => {
        return runInAction(() => {
          this.initializationError = e;
        });
      });
  }

  get doCheckAuth() {
    if (firebaseService.getCurrentUser()) {
      return this.activeUser;
    } else {
      return null;
    }
  }
  /**
   * here we check to see if ionic saved a user for us
   */
  get authenticatedUser() {
    return this.activeUser || null;
  }

  /**
   * gets all of the items as an array from the map
   */
  get itemEntries() {
    return entries(this.items);
  }
/**
   * gets all of the scores as an array from the map
   */
  get scoreEntries() {
    return entries(this.scores);
  }
  /**
   * get a specific item based on its key
   * @param {*} _key
   */
  itemByKey(_key) {
    return get(this.items, _key);
  }

  /**
   * login using a username and password
   */
  doLogin(_username, _password) {
    if (_username.length) {
      return firebaseService
        .loginWithEmail(_username, _password)
        .then( async (_result) => {
            return _result;
          },
          (err) => {console.log(err);
            return err;
          }
        )
        .catch((e) => {console.log(e);
          return e;
        });
    }
  }
  google_Login(){
    return firebaseService
    .googleLogin()
    .then( async (_result) => {
      return _result;
    },
    (err) => {console.log(err);
      return err;
    }
  )
  }
  twitter_Login(){
    return firebaseService
    .twitterLogin()
    .then( async (_result) => {
      return _result;
    },
    (err) => {console.log(err);
      return err;
    }
  )
  }
  facebook_Login(){
    return firebaseService
    .facebookLogin()
    .then( async (_result) => {
            return _result;
          },
          (err) => {console.log(err);
            return err;
          }
        )
  }
  
  /**
   * create the user with the information and set the user object
   */
  async doCreateUser(_params) {
    try {
      let newUser = await firebaseService.registerUser({
        email: _params.email,
        password: _params.password,
        firstName: _params.firstName,
        lastName: _params.lastName,
      });
      return newUser;
    } catch (err) {
      debugger;
      console.log(err);
      return err;
      // for (let e of err.details) {
      //   if (e === "conflict_email") {
      //     alert("Email already exists.");
      //   } else {
      //     // handle other errors
      //   }
      // }
    }
  }

  /**
   * logout and remove the user...
   */
  doLogout() {
    this.activeUser = null;
    return firebaseService.logOut();
  }

  // DATA CRUD
  loadData(_collection) {
    return firebaseService
      .queryObjectCollection({ collection: _collection })
      .then(
        (_result) => {
          // create the user object based on the data retrieved...
          return runInAction(() => {
            //console.log("REsult:"+_result);
            let resultMap = _result.reduce((map, obj) => {
              map[obj.id] = obj;
              return map;
            }, {});
            if(_collection==="items"){
                this.items = resultMap;
            }else if(_collection==="score"){
                this.scores = resultMap;
            }
            return resultMap;
          });
        },
        (err) => {
          console.log(err);
          return err;
        }
      )
      .catch((e) => {
        console.log(e);
        return e;
      });
  }
  addItem(_collection,_data) {
      return firebaseService
        .addObjectToCollection({ collection: _collection, objectData: _data })
        .then((_result) => {
            // create the user object based on the data retrieved...
            if(_collection==="items"){
            return runInAction(() => {
              set(this.items, _result.id, _result);
              return _result;
            });
          }
          },
          (err) => {
            console.log(err);
            return err;
          }
        )
        .catch((e) => {
          console.log(e);
          return e;
        });
    }
    addScore(_data){
      return firebaseService
      .queryUserCollection({collection: "score", accountId:this.activeUser.id})
      .then( (_result) => {
            //console.log("Data",_data);
            if(_result[0]=== undefined){
              this.addItem("score",_data);
              console.log("Score:","added")
              this.loadData("score");
              return true;
            }else{
              console.log("rankV",_result[0].content.rankvalue);
              console.log("dataV",_data.rankvalue);
             if( Number(_data.rankvalue) < Number(_result[0].content.rankvalue)){
              return firebaseService
              .setObjectToCollection({collection: "score", objectId:_result[0].id, objectData:_data})
              .then((e)=>{
                console.log("Score:","updated")
                this.loadData("score");
                return true;
              });
             
             }else{
                console.log("Score:","not update")
               return
             }
            }
        }
      ).catch((e)=>{
        console.log(e);
        return e;
      });
    }
  
  deleteItem(_collection,_data) {
    return firebaseService
      .removeObjectFromCollection({ collection: _collection, objectId: _data.id })
      .then(
        (_result) => {
          // create the user object based on the data retrieved...
          return runInAction(() => {
            remove(this.items, _data.id);
            return true;
          });
        },
        (err) => {
          console.log(err);
          return err;
        }
      )
      .catch((e) => {
        console.log(e);
        return e;
      });
  }

  addPoint(point){
    this.shooting_point += point;
  }
  get shootPoint(){
    return this.shooting_point;
  }

  

}




decorate(Store, {
  // OBSERVABLES
  activeUser: observable,
  loading: observable,
  authCheckComplete: observable,
  items: observable,
  scores: observable,
  shooting_score: observable,
  initializationError: observable,

  // COMPUTED
  authenticatedUser: computed,
  doCheckAuth: computed,
  itemEntries: computed,
  scoreEntries: computed,
  shootPoint: computed,

  // ACTIONS
  doCreateUser: action,
  doLogin: action,
  google_Login: action,
  twitter_Login: action,
  facebook_Login: action,
  doLogout: action,
  loadData: action,
  itemByKey: action,
  addItem: action,
  addScore: action,
  deleteItem: action,
  addPoint: action,
});
