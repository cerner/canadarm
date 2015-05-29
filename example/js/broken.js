/* global alert,document */

/**
 * The purpose of this file is to allow easy functional testing
 * of this library.  Each function in here breaks and that is on purpose.
 * There is a little bit of logic for testing older IE versions.
 *
 * Only add to this file if new tests are needed or new functionality
 * is added to the library.
 */

function broken_function(thing) {
    thing.hi = one;
}

function broken_watched_function(thing) {
    thing.bye = two;
}

function broken_attempted_function(thing) {
    thing.cry = three;
}

// Test out the difference between IE and newer browsers for
// event handling.
var addElement = document.getElementById('addClick'),
  removeElement = document.getElementById('removeClick'),
  addBackElement = document.getElementById('addClickBack');

function addedEvent() {
  console.log('You cilcked a button!');
  x + t;
}

if (window.localPage) {
  // Use the .watch call so that we can spy on a function called
  // by an event without having to globally override attachEvent
  addElement.addEventListener('click', Canadarm.watch(addedEvent));
  removeElement.addEventListener('click', function () {
    addElement.removeEventListener('click', Canadarm.watch(addedEvent));
  });

  addBackElement.addEventListener('click', function () {
    addElement.addEventListener('click', Canadarm.watch(addedEvent));
  });
} else {
  addElement.addEventListener('click', addedEvent);
  removeElement.addEventListener('click', function () {
    addElement.removeEventListener('click', addedEvent);
  });
  addBackElement.addEventListener('click', function () {
    addElement.addEventListener('click', addedEvent);
  });
}


document.getElementById('link').addEventListener('click', addedEvent);

// Examples showing how the watch and attempt work differenlty.
Canadarm.watch(broken_watched_function)();
Canadarm.attempt(broken_attempted_function);

// Example of a function definition being watched
// You can call globalTestt and see that this function
// is routed through the error handlers.
var globalTestIt = Canadarm.watch(function () {
  console.log('how are you?');
  console.log(x + y);
});

// This final call is to show what happens when a broken function is called.
broken_function();
