import { Component, OnInit } from '@angular/core';
import { ModalDialogParams } from 'nativescript-angular/modal-dialog';
import { TextField } from 'ui/text-field';
 import { Slider } from 'ui/slider';
import { Page } from 'ui/page';

@Component({
    moduleId: module.id,
    templateUrl: './comment.component.html'
})
export class CommentComponent implements OnInit {

    constructor(private params: ModalDialogParams,
        private page: Page) {
    }

    ngOnInit() {

        let author: TextField = <TextField>this.page.getViewById<TextField>('author');
        let rating: Slider = <Slider>this.page.getViewById<Slider>('rating');
        let comment: TextField = <TextField>this.page.getViewById<TextField>('comment');
    }

    public submit() {
        let author: TextField = <TextField>this.page.getViewById<TextField>('author');
        let rating: Slider = <Slider>this.page.getViewById<Slider>('rating');
        let comment: TextField = <TextField>this.page.getViewById<TextField>('comment');
        this.params.closeCallback([{author: author.text, 
                                    rating: rating.value, 
                                    comment: comment.text,
                                    date: new Date().toISOString()}]);
    }
}