import firebase from 'firebase';
import FirebaseServer from 'firebase-server';
import detect from 'detect-port';

export async function startFirebaseTestServer() {
  let server;
  const port = await detect(5000);
  if (port === 5000) {
    server = new FirebaseServer(5000, '127.0.0.1', {
      states: {
        CA: 'California',
        AL: 'Alabama',
        KY: 'Kentucky'
      }
    });
  }
  const ref = firebase.app().database().ref();
  return {
    server,
    ref
  };
}
