// Represents a Message
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

// UI Class: Handles UI Tasks
class UI {
  displayMessages() {}
  sendMessage() {}
  showUserModal() {}
  closeUserModal() {}
}

// Event: Display Messages

// Event: Send message

// Event: Show User Modal

// Event: Close User Modal
