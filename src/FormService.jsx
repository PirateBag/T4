import {validateAllFieldsOnForm} from "./Metadata/ValidateRule.js";
import axios from "axios";
import itemQuery, {itemQueryUrl} from "./ItemQuery.jsx";
import {ScreenTransition} from "./ScreenTransition.js";
import {ScreenStack} from "./Stack.js";

export class FormService {
    constructor(options) {
        this.messagesFromForm = options.messagesFromForm;
        this.messageFromFormSetter = options.messageFromFormSetter;
        this.buttonLabel = options.buttonLabel;
        this.url = options.url;
    }

    handleSubmit = async (event) => {
        event.preventDefault();

        let messagesFromFormValidation = validateAllFieldsOnForm(event);
        this.messageFromFormSetter(messagesFromFormValidation);

        if (messagesFromFormValidation.length > 0) return;

        const formData = new FormData(event.target);
        const newPost = Object.fromEntries(formData.entries());

        axios.post(itemQueryUrl, newPost)
            .then(response => {
                this.messageFromFormSetter("User has logged in");
                let nextScreen = new ScreenTransition(itemQuery, 'NONE', response.data);
                ScreenStack.pushToNextScreen(nextScreen);
                //  props.stackLengthCallback(ScreenStack.items.length, new LoginSummary(newPost.userName, response.data.token));
            })
            .catch(error => {
                console.error('Error creating post:', error);
            });
    }
}