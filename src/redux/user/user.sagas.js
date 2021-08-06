import { takeLatest, put, all, call} from '@redux-saga/core/effects';

import { UserActionTypes } from './user.types';

import { 
  signInSuccess, 
  signInFailure, 
  signOutSuccess, 
  signOutFailure,
  signUpSuccess,
  signUpFailure
} from './user.actions';

import { auth, googleProvider, createUserProfileDocument, getCurrentUser } from '../../firebase/firebase.utils';

//todo: Here we create a generator function where we catch the userAuth and the additional Data
export function* getSnapshotFromUserAuth(userAuth, additionalData){
  try{
    const userRef = yield call(
      createUserProfileDocument,
      userAuth,
      additionalData
    )
    const userSnapshot = yield userRef.get();
    yield put(signInSuccess({id: userSnapshot.id, ...userSnapshot.data()}))
  }catch(error){
    yield put(signInFailure(error));
  }
}

export function* signInWithGoogle(){
  try{
    const {user} = yield auth.signInWithPopup(googleProvider);
    yield getSnapshotFromUserAuth(user)
  }catch(error){
    yield put(signInFailure(error));
  }
}

export function* signInWithEmail({payload: {email, password}}){
  try{
    const {user} = yield auth.signInWithEmailAndPassword(email, password);
    yield getSnapshotFromUserAuth(user)
  }catch(error){
    yield put(signInFailure(error));
  }
}

export function* isUserAuthenticated(){
  try{
    const userAuth = yield getCurrentUser();
    if(!userAuth) return;
    yield getSnapshotFromUserAuth(userAuth); 
  }catch(error){
    yield put(signInFailure(error));
  }
}

export function* signOut() {
  try {
    yield auth.signOut();
    yield put(signOutSuccess());
  } catch (error) {
    yield put(signOutFailure(error));
  }
}

export function* signUp({ payload: { email, password, displayName } }) {
  try {
    const { user } = yield auth.createUserWithEmailAndPassword(email, password);
    yield put(signUpSuccess({ user, additionalData: { displayName } }));
  } catch (error) {
    yield put(signUpFailure(error));
  }
}

export function* signInAfterSignUp({ payload: { user, additionalData } }) {
  yield getSnapshotFromUserAuth(user, additionalData);
}

//todo: This is for GOOGLE_SIGN_IN_START 
export function* onGoogleSignInStart() {
  yield takeLatest(UserActionTypes.GOOGLE_SIGN_IN_START, signInWithGoogle);
}

//todo: This is for EMAIL_SIGN_IN_START
export function* onEmailSignInStart(){
  yield takeLatest(UserActionTypes.EMAIL_SIGN_IN_START, signInWithEmail )
}

//todo: To authenticate the user session
export function* onCheckUserSession(){
  yield takeLatest(UserActionTypes.CHECK_USER_SESSION, isUserAuthenticated);
}

export function* onSignOutStart() {
  yield takeLatest(UserActionTypes.SIGN_OUT_START, signOut);
}

export function* onSignUpStart() {
  yield takeLatest(UserActionTypes.SIGN_UP_START, signUp);
}

export function* onSignUpSuccess() {
  yield takeLatest(UserActionTypes.SIGN_UP_SUCCESS, signInAfterSignUp);
}
//todo: From User saga we export all the sagas and import this saga to the main saga.
export function* userSagas(){
  yield all([
    call(onGoogleSignInStart), 
    call(onEmailSignInStart),
    call(onCheckUserSession),
    call(onSignOutStart),
    call(onSignUpStart),
    call(onSignUpSuccess)
  ])
}