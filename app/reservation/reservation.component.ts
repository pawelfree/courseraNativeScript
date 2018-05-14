import { Component, OnInit, Inject, ChangeDetectorRef, ViewContainerRef } from '@angular/core';
import { DrawerPage } from '../shared/drawer/drawer.page';
import { TextField } from 'ui/text-field';
import { Switch } from 'ui/switch';
import { Validators, FormBuilder, FormGroup} from '@angular/forms';
import { ModalDialogService, ModalDialogOptions } from "nativescript-angular/modal-dialog";
import { ReservationModalComponent } from "../reservationmodal/reservationmodal.component";
import { CouchbaseService } from '../services/couchbase.service';
import { Page } from "ui/page";
import { View } from "ui/core/view";
import * as enums from "ui/enums";

@Component({
    selector: 'app-reservation',
    moduleId: module.id,
    templateUrl: './reservation.component.html'
})
export class ReservationComponent extends DrawerPage implements OnInit {

    reservation: FormGroup;
    docId: string = "reservations";
    reservations: Array<{guests: number; smoking: boolean; dateTime: Date}>;
    showReservationCard: boolean = true;
    showConfirmationCard: boolean = false;

    constructor(private changeDetectorRef: ChangeDetectorRef,
        private formBuilder: FormBuilder,
        private modalService: ModalDialogService,
        private couchbaseService: CouchbaseService,
        private page: Page,
        private vcRef: ViewContainerRef) {
            super(changeDetectorRef);

            this.reservation = this.formBuilder.group({
                guests: 3,
                smoking: false,
                dateTime: ['', Validators.required]
            });
    }

    ngOnInit() {

    }

    addReservation(reservation) {

        let doc = this.couchbaseService.getDocument(this.docId);
        if( doc == null) {
            this.couchbaseService.createDocument({"reservations": []}, this.docId);
            this.reservations = [];
            console.log("This is the first reservation");
            console.log(JSON.stringify(reservation));
        }
        else {
            this.reservations = doc.reservations;
        }

        this.reservations.push(reservation);
        this.couchbaseService.updateDocument(this.docId, {"reservations": this.reservations});

        console.log(JSON.stringify(this.couchbaseService.getDocument("reservations")));
    }

    createModalView(args) {

        let options: ModalDialogOptions = {
            viewContainerRef: this.vcRef,
            context: args,
            fullscreen: false
        };

        this.modalService.showModal(ReservationModalComponent, options)
            .then((result: any) => {
                if (args === "guest") {
                    this.reservation.patchValue({guests: result});
                }
                else if (args === "date-time") {
                    this.reservation.patchValue({ dateTime: result});
                }
            });

    }

    onSmokingChecked(args) {
        let smokingSwitch = <Switch>args.object;
        if (smokingSwitch.checked) {
            this.reservation.patchValue({ smoking: true });
        }
        else {
            this.reservation.patchValue({ smoking: false });
        }
    }

    onGuestChange(args) {
        let textField = <TextField>args.object;

        this.reservation.patchValue({ guests: textField.text});
    }

    onDateTimeChange(args) {
        let textField = <TextField>args.object;

        this.reservation.patchValue({ dateTime: textField.text});
    }

    onSubmit() {
        console.log(JSON.stringify(this.reservation.value));
        this.addReservation(this.reservation.value);
        this.animate();
    }

    animate() {

    var reservationCard = this.page.getViewById<View>('reservationCard');
    var confirmationCard = this.page.getViewById<View>('confirmationCard');
    
    reservationCard.animate({
        scale: {x: 0, y :0},
        opacity: 0,
        duration: 500,
        curve: enums.AnimationCurve.easeIn
        })
        .then(() => {
            this.showReservationCard = false;
            this.showConfirmationCard = false;
            confirmationCard.animate({
                scale: {x: 0, y: 0 },
                opacity: 0,
                duration: 1,
                curve: enums.AnimationCurve.easeIn})            
                .then(() => {
                    this.showReservationCard = false;
                    this.showConfirmationCard = true;
                    confirmationCard.animate({
                        scale: {x: 1, y: 1 },
                        opacity: 1,
                        duration: 500,
                        curve: enums.AnimationCurve.easeIn});
                
                });
        });
    }    

}