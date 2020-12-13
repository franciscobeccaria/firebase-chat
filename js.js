// Global variables:
const db = firebase.firestore();

// Firestore data converter
var messageConverter = {
  toFirestore: function (message) {
    return {
      name: message.name,
      email: message.email,
      userPhoto: message.userPhoto,
      messageData: message.messageData,
      date: message.date,
    };
  },
  fromFirestore: function (snapshot, options) {
    const data = snapshot.data(options);
    return new Message(data.name, data.email, data.userPhoto, data.messageData, data.date);
  },
};

// Message Class: Represents a Message
class Message {
  constructor(name, email, userPhoto, messageData, date) {
    this.name = name;
    this.email = email;
    this.userPhoto = userPhoto;
    this.messageData = messageData;
    this.date = date;
  }
  toString() {
    return this.name + ', ' + this.email + ', ' + this.userPhoto + ', ' + this.messageData + ', ' + this.date;
  }
}

// Firebase Class: Handles Firebase Tasks
class Firebase {
  static getMessages() {
    db.collection('messages')
      .orderBy('date', 'desc')
      .limit(30)
      .onSnapshot(function (querySnapshot) {
        const container = document.getElementById('messages-container');
        container.innerHTML = '';
        querySnapshot.forEach(function (doc) {
          UI.displayMessages(doc.data());
        });
      });
  }
  static sendMessage(message) {
    // Set with messageConverter
    db.collection('messages').doc().withConverter(messageConverter).set(message);
  }
}

// UI Class: Handles UI Tasks
class UI {
  static displayMessages(data) {
    const dateString = moment(data.date).format('HH:mm - ddd, MMM D, YYYY');

    const messagesContainer = document.querySelector('#messages-container');

    const message = `
    <div class="message-container">
        <div 
            id="user-photo" 
            class="user-photo" 
            style="background-image: url(${data.userPhoto});">
        </div>
        <div id="message" class="message">
            <p id="message-info" class="message-info">${data.messageData}</p>
            <p id="message-date" class="message-date">${dateString}</p>
        </div>
        <div id="meta" class="no-show">
            <div id="meta-name">${data.name}</div>
            <div id="meta-email">${data.email}</div>
            <div id="meta-photo">${data.userPhoto}</div>
        </div>
    </div>
    `;

    messagesContainer.insertAdjacentHTML('beforeend', message);
  }
  static inputMessage() {
    if (document.getElementById('input-msg').value.trim() === '') {
      alert('Please insert something');
    } else {
      const currentUser = firebase.auth().currentUser;
      const messageData = document.getElementById('input-msg').value.trim();
      const messageUserName = currentUser.displayName;
      const messageUserEmail = currentUser.email;
      const messageUserPhoto = currentUser.photoURL;
      const messageDate = Date.now();
      const message = new Message(messageUserName, messageUserEmail, messageUserPhoto, messageData, messageDate);
      Firebase.sendMessage(message);
      document.getElementById('input-msg').value = '';
    }
  }
  static showUserModal(data) {
    document.getElementById('modal-container').classList.remove('no-show');
    document.getElementById('user-modal-name').innerHTML = data.name;
    document.getElementById('user-modal-email').innerHTML = data.email;
    document.getElementById('modal-user-photo').style.backgroundImage = `url(${data.photo})`;
  }
  static closeUserModal() {
    document.getElementById('modal-container').classList.add('no-show');
    document.getElementById('user-modal-name').innerHTML = '';
    document.getElementById('user-modal-email').innerHTML = '';
  }
}

// Event: Get & Display Messages
document.addEventListener('DOMContentLoaded', Firebase.getMessages);
// Event: Send message if click search button or if press enter key.
document.getElementById('send-btn').addEventListener('click', UI.inputMessage);
document.addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    UI.inputMessage();
  }
});
// Event: Show User Modal
document.addEventListener('click', (e) => {
  if (e.target.id === 'user-photo') {
    const userPhoto = e.target;
    const userName = userPhoto.nextElementSibling.nextElementSibling.firstElementChild.innerHTML;
    const userEmail = userPhoto.nextElementSibling.nextElementSibling.firstElementChild.nextElementSibling.innerHTML;
    const userPhotoLink =
      userPhoto.nextElementSibling.nextElementSibling.firstElementChild.nextElementSibling.nextElementSibling.innerHTML;
    const userData = {
      name: userName,
      email: userEmail,
      photo: userPhotoLink,
    };
    UI.showUserModal(userData);
  }
});
// Event: Close User Modal
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-container')) {
    UI.closeUserModal();
  }
});

// Firebase Listener: Listen if user is logged or not
firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    // User is signed in.
    document.getElementById('login').classList.add('no-show');
    document.getElementById('chat').classList.remove('no-show');
  } else {
    // No user is signed in.
    document.getElementById('chat').classList.add('no-show');
    document.getElementById('login').classList.remove('no-show');
  }
});

// Authentication Class: Handles Authentication Tasks
class Authentication {
  static async authGoogle() {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      const result = await firebase.auth().signInWithPopup(provider);
      return undefined;
    } catch (error) {
      console.error(error);
      alert(`Error: ${error}`);
    }
  }
  static signOut() {
    try {
      firebase.auth().signOut();
    } catch (error) {
      console.error(error);
    }
  }
}
// Event: Login button
document.getElementById('btn-google-login').addEventListener('click', async () => {
  const user = await Authentication.authGoogle();
});
// Event: Signout button
document.getElementById('signout-btn').addEventListener('click', () => {
  Authentication.signOut();
});
