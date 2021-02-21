import firebase  from "firebase"; // 4.3.0 => 8.0.0

require("firebase/firestore");

var firebaseConfig = {
 // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  apiKey: "AIzaSyDlBCD-de_e9CciwJAarNL6X1PHfIqPmGU",
  authDomain: "auth-master-f7669.firebaseapp.com",
  databaseURL: "https://auth-master-f7669.firebaseio.com",
  projectId: "auth-master-f7669",
  storageBucket: "auth-master-f7669.appspot.com",
  messagingSenderId: "950941405992",
  appId: "1:950941405992:web:07b4bca91a57a208ed361d",
  measurementId: "G-Q7E8XNTMK1"
};


// Ensure that you do not login twice.
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

/**
 * so this function is called when the authentication state changes
 * in the application, a side effect of that is that we need to get
 * the rest of the user data from the user collection, that is
 * done with the _handleAuthedUser callback
 */
export const authCheck = async (_handleAuthedUser) => {
  return new Promise((resolve) => {
    // Listen for authentication state to change.
    firebase.auth().onAuthStateChanged(async (user) => {
      if (user != null) {
        console.log("We are authenticated now!");

        return resolve(await _handleAuthedUser(user));
      } else {
        console.log("We did not authenticate.");
        _handleAuthedUser(null);
        return resolve(null);
      }
    });
  });
};

/**
 *
 * @param {*} email
 * @param {*} password
 */
export const loginWithEmail = (email, password) => {
  return firebase.auth().signInWithEmailAndPassword(email, password);
};

export const googleLogin =() =>{
  var provider = new firebase.auth.GoogleAuthProvider();

  return providerLogin(provider)
}
export const twitterLogin =() =>{
  var provider = new firebase.auth.TwitterAuthProvider();
  return providerLogin(provider)
}
export const facebookLogin =() =>{
  var provider = new firebase.auth.FacebookAuthProvider();
  return providerLogin(provider)
}
const providerLogin=(provider) =>{
  var user = firebase.auth().currentUser;
  if (user) {
    console.log("logined:");
  } else {
  return firebase.auth().signInWithPopup(provider)
    .then((result) => {
      let p_user = result.user
      let email = p_user.email;
      let uid = p_user.uid;
      let dispname = p_user.displayName.split(' ');
      let firstName = dispname[0];
      let lastName = dispname[1]?dispname[1]:'';
      console.log("User:",uid);

      return firebase.firestore().collection("users").doc(uid)
      .set({
        email,
        firstName,
        lastName,
      })
      .then(() => {
        return { email:email, firstName:firstName, lastName:lastName };
      });
    },
    (error) =>{console.log("Error",error)}
    
    ).catch((error)=> {return error});

  }
}

export const getCurrentUser = () => {
  return firebase.auth().currentUser;
};
/**
 *
 */
export const logOut = () => {
  return firebase.auth().signOut();
};

/**
 *
 * @param {*} userInfo.lastName
 * @param {*} userInfo.firstName
 * @param {*} userInfo.email
 * @param {*} userInfo.password
 */
export const registerUser = (userInfo) => {
  console.log("in registerUser");
  return firebase
    .auth()
    .createUserWithEmailAndPassword(userInfo.email, userInfo.password)
    .then((newUser) => {
      let { email, firstName, lastName } = userInfo;

      return firebase
        .firestore()
        .collection("users")
        .doc(newUser.user.uid)
        .set({
          email,
          firstName,
          lastName,
        })
        .then(() => {
          return { ...newUser.user, firstName, lastName };
        });
    });
};

/**
 *
 */
export const getUserProfile = () => {
  let user = firebase.auth().currentUser;
  //console.log(user.uid);

  var userRef = firebase.firestore().collection("users").doc(user.uid);

  return userRef
    .get()
    .then((doc) => {
      if (doc.exists) {
       // console.log("Document data:", doc.data());
        return {
          ...doc.data(),
          id: user.uid,
        };
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!", user.uid);
        return null;
      }
    })
    .catch((error) => {
      console.log("Error getting document:", error);
    });
};

/**
 *
 * @param {*} param0
 */
export const queryObjectCollection = ({ collection }) => {
  let currentUserId = firebase.auth().currentUser.uid;
  let collectionRef = firebase.firestore().collection(collection);

  let results = [];

  return (
    collectionRef
      //.where('owner', '==', currentUserId)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          results.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        return results;
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
        return error;
      })
  );
};
export const queryUserCollection = ({ collection,accountId }) => {
 // let currentUserId = firebase.auth().currentUser.uid;
  let collectionRef = firebase.firestore().collection(collection);
  let results = [];

    return collectionRef
      //.where('owner', '==', currentUserId)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          results.push({
            id:doc.id,
            uid: doc.data().owner,
            ...doc.data(),
          });
          console.log("DocID:",doc.id);
        });
      
        let data=  results.filter((value) => {return accountId.indexOf(value.uid)>-1 });
        //console.log("userid:",accountId);
        //console.log("DATA:",data);
        return data;
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
        return error;
      })
    }
/**
 *
 * @param {*} _collection - name of collection to add object to
 * @param {*} _objectData - data to add to the collection
 */
export const addObjectToCollection = ({ collection, objectData }) => {
  let currentUserId = firebase.auth().currentUser.uid;
  let collectionRef = firebase.firestore().collection(collection);

  return collectionRef
    .add({
      owner: currentUserId,
      content: { ...objectData },
      created: new Date().getTime(),
      updated: new Date().getTime(),
    })
    .then(
      async (doc) => {
        console.log(`addObjectToCollection ${collection} ${doc}`);
        console.log("DOC",doc)

        let docData = await getByRef(doc);
        return docData;
      },
      (error) => {
        console.log(`ERROR: addObjectToCollection ${collection} ${error}`);
        return error;
      }
    )
    .catch((e) => {
      console.log(`ERROR: addObjectToCollection ${collection} ${e}`);
      return e;
    });
};
export const setObjectToCollection = ({ collection, objectId,objectData }) => {
  let currentUserId = firebase.auth().currentUser.uid;
  let collectionRef = firebase.firestore().collection(collection).doc(objectId);

  return collectionRef
    .set({
      owner: currentUserId,
      content: { ...objectData },
      created: new Date().getTime(),
      updated: new Date().getTime(),
    })
    .then( (success) => {
        
        return success;
      },
      (error) => {
        console.log(`ERROR: setObjectToCollection ${collection} ${error}`);
        return error;
      }
    )
    .catch((e) => {
      console.log(`ERROR: addObjectToCollection ${collection} ${e}`);
      return e;
    });
};
/**
 *
 * @param {*} collection - name of collection
 * @param {*} objectId - id of data to remove from the collection
 */
export const removeObjectFromCollection = ({ collection, objectId }) => {
  let currentUserId = firebase.auth().currentUser.uid;
  let collectionRef = firebase.firestore().collection(collection);

  return collectionRef
    .doc(objectId)
    .delete()
    .then(
      async (doc) => {
        console.log(`removeObjectFromCollection ${collection} ${objectId}`);
        return true;
      },
      (error) => {
        console.log(`ERROR: removeObjectFromCollection ${collection} ${error}`);
        return error;
      }
    )
    .catch((e) => {
      console.log(`ERROR: removeObjectFromCollection ${collection} ${e}`);
      return e;
    });
};

export const getByRef = (_documentRef) => {
  return _documentRef
    .get()
    .then((doc) => {
      if (doc.exists) {
        return { ...doc.data(), id: _documentRef.id };
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
        return null;
      }
    })
    .catch((error) => {
      console.log("Error getting document:", error);
      return error;
    });
};

/**
 *
 * @param {*} blob
 */
export const uploadImage = (blob) => {
  return new Promise((resolve, reject) => {
    let currentUserId = firebase.auth().currentUser.uid;
    const ref = firebase
      .storage()
      .ref(currentUserId)
      .child(new Date().getTime() + "-" + currentUserId + ".jpeg");

    const task = ref.put(blob);

    task.on(
      firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) =>
        console.log((snapshot.bytesTransferred / snapshot.totalBytes) * 100),
      (error) => {
        console.log("error", error);
        return reject(error);
      },
      (result) => {
        return resolve({
          url: task.snapshot.downloadURL,
          contentType: task.snapshot.metadata.contentType,
          name: task.snapshot.metadata.name,
          size: task.snapshot.metadata.size,
        });
      }
    );
  });
};
