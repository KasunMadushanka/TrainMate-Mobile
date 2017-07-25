import { Injectable } from '@angular/core';
import { AngularFire } from 'angularfire2';
import { Storage } from '@ionic/storage';
import { Camera} from '@ionic-native/camera';
import firebase from 'firebase';

@Injectable()
export class UserProvider {

    public picture: string = null;

    constructor(public af:AngularFire, public local:Storage,public camera:Camera) { }

    // Get Current User's UID
    getUid() {
        return this.local.get('uid');
    }

    getDeviceToken() {
        return this.local.get('device_token');
    }

    // Create User in Firebase
    createUser(userCredentails, uid) {
        let currentUserRef = this.af.database.object(`/users/${uid}`);
        console.log(userCredentails);
        currentUserRef.set({
            first_name:userCredentails.first_name,
            last_name:userCredentails.last_name,
            mobile:userCredentails.mobile,
            email:userCredentails.email,
            picture:"",
            device_token:"",
            status:0
        });
    }

    // Get Info of Single User
    getUser() {
        // Getting UID of Logged In User
        return this.getUid().then(uid => {
            return this.af.database.object('/users/${uid}', { preserveSnapshot: true });
        });
    }


    // Get All Users of App
    getAllUsers() {
        return this.af.database.list('/users');
    }

    takePicture(option){

        let type;

        if(option==1){
            type=this.camera.PictureSourceType. CAMERA;
        }else{
            type=this.camera.PictureSourceType. PHOTOLIBRARY;
        }

        return this.camera.getPicture({
            quality : 100,
            destinationType : this.camera.DestinationType.DATA_URL,
            sourceType : type,
            cameraDirection:this.camera.Direction.FRONT,
            allowEdit : true,
            encodingType: this.camera.EncodingType.JPEG,
            targetWidth: 500,
            targetHeight: 500,
            correctOrientation: true,
            saveToPhotoAlbum: true
        }).then(imageData => {
            this.picture = imageData;
            let base64Image = 'data:image/jpeg;base64,' + imageData;
            return imageData;
        }, error => {
            console.log("ERROR -> " + JSON.stringify(error));
        });

    }

}
