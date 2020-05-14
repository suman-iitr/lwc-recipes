/* eslint-disable eqeqeq */
/* eslint-disable array-callback-return */
/* eslint-disable no-console */
/* eslint-disable no-alert */

import {
    LightningElement,
    api,
    track
} from "lwc";

export default class SimpleMultiSelect extends LightningElement {
    @api allList = []; //receive the full list from calling component
    @api placeHolder = 'Search...'; // Display place holder Text in the input box
    @api labelName = '';
    @track displayList = [];
    @api selectedList = [];

    @track searchInput = '';
    @track listOpened = false;
    @track comboClass = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click';
   
    connectedCallback()
    {
        this.allList.map(allListElement => {
                
            if (allListElement.selected) {

                    this.selectedList = [
                        ...this.selectedList,
                        {
                            label: allListElement.label,
                            value: allListElement.value,
                            selected: allListElement.selected
                        }
                    ]
                
            }
            
        });
    }
    
    SearchClick() {
        
        if (!this.listOpened) {

           this.listOpened = true;
           this.comboClass = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-is-open'; 

            this.displayList = []; //initialize the array before assigning values coming from apex
            
            this.allList.map(allListElement => {
                
                if (allListElement.selected) {

                    if (this.selectedList.find(element => element.value == allListElement.value) == null) {
                        this.selectedList = [
                            ...this.selectedList,
                            {
                                label: allListElement.label,
                                value: allListElement.value,
                                selected: allListElement.selected
                            }
                        ]
                    }
                }
                this.displayList = [
                    ...this.displayList,
                    {
                        label: allListElement.label,
                        value: allListElement.value,
                        selected: (this.selectedList.find(element => element.value == allListElement.value) != null) 
                    }
                ];

            });
        }
        else if (this.listOpened)
        {
            this.searchInput = ''; //clearing the text
            this.listOpened = false;
            this.comboClass = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click';
           
        }
    }

    ChangeSearchInput(event) {
        
       
       this.listOpened = true;
       this.comboClass = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-is-open'; 


        this.searchInput = event.target.value.toLowerCase();
        
        this.displayList = []; //initialize the array before assigning values coming from apex
        
        let filterList = this.allList.filter(
            item => item.value.toLowerCase().includes(this.searchInput.trim()) == true
        );

        filterList.map(allListElement => {
            this.displayList = [
                ...this.displayList,
                {
                    label: allListElement.label,
                    value: allListElement.value,
                    selected: this.selectedList.find(element => element.value == allListElement.value) != null
                }
            ];

            
        });
    }


    handleCheckboxChange(e) {


        if (e.detail.checked) {

            if (this.selectedList.find(element => element.value == e.target.value) == null) {
                this.selectedList = [
                    ...this.selectedList,
                    {
                        label: e.target.label,
                        value: e.target.value,
                        selected: e.detail.checked
                    }
                ]
            }
        } else // unchecked 
        {
            this.selectedList = this.selectedList.filter(
                item => item.value != e.target.value
            );
        }

        this.displayList.map(element => {

            if (element.value == e.target.value) {

                element.selected = e.detail.checked;

            }

        });

    }

    handleRemoveRecord(e) {
        const removeItem = e.target.dataset.item;

        this.selectedList = this.selectedList.filter(item => item.value != removeItem);

        this.displayList.map(element => {

            if (element.value == removeItem) {

                element.selected = false;

            }

        });

        
    }

}