// Objetos: Usuarios. Mensajes.
// En realidad los Usuarios se instancian en el backend. Y los mensajes son lo que se instancian en el frontend.
// El modal del Usuario se instancia en el frontend también. Quizas ese podría ser un objeto.

// Firebase va ser:
// Collection Users
//      Document User (uid)
//          name, email, userPhoto, dateCreated
// Collection Messages
//      Document Message
//          name, email, userPhoto, message, date

class UserModal {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }
  close() {
    // se instancia dando click a la foto del usuario. este close deberá borrar el HTML insertado.
    // debería guardarlo en cache, para que no sea un bodrio si abro y cierro.
  }
}

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
  showUserModal() {}
  closeUserModal() {}
}

const loadMessages = () => {
  db.collection('messages').onSnapshot(function (querySnapshot) {
    var messages = [];
    //const container = document.getElementById('my-lists-info-container');
    //container.innerHTML = '';
    querySnapshot.forEach(function (doc) {
      messages.push(doc.data().name);
      //lists.push(doc.id);
      //drawMyLists(doc.id);
    });
    console.log('Current messages: ', messages.join(', '));
  });
};

const drawMessages = (data) => {
  const container = document.getElementById('my-lists-info-container');
  const listContainer = `
              <button class="list-select" onclick="window.location.href='./list.html?list=${listName.replace(
                /\s/g,
                '-'
              )}'"><p>${listName}</p></button>
  `;
  container.insertAdjacentHTML('beforeend', listContainer);
};

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

const sendMessage = () => {
  const messageData = {}; // input.value
  const messageUserName = {}; // firebase.currentUser.displayName
  const messageUserEmail = {}; // firebase.currentUser.email
  const messageUserPhoto = {}; // firebase.currentUser.photo
  const messageDate = {}; // new Date
  // Set with messageConverter
  db.collection('messages')
    .doc()
    .withConverter(messageConverter)
    .set(new Message(messageUserName, messageUserEmail, messageUserPhoto, messageData, messageDate));
};

// Resumen de funciones:
//      load & draw Messages
//      sendMessage
//      signout
//      login
//      show & close UserModal
//      Listener if user is logued or not
//      show Login or MessageContainer
