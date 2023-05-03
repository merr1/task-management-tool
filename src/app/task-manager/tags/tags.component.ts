import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';

export interface Tag{
  tagName:string;
}

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss']
})
export class TagsComponent implements OnInit {
  @Input() tagsFormGroup! : FormGroup;
  @Output() getVal : EventEmitter<any> = new EventEmitter<any>();
  
  // tagList: string[] = ['Bugs', 'Design', 'Programming', 'Data Analysis', 'Code Review'];
  constructor() { }
  ngOnInit(): void {
    
  }
  
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  add(event: MatChipInputEvent): void {
    const value = event.value;

    // Add our tag
    if ((value || '').trim()) {
      this.tagsFormGroup.controls['tag'].setValue([...this.tagsFormGroup.controls['tag'].value, {"tagName":value}]);
      this.tagsFormGroup.controls['tag'].updateValueAndValidity();
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  remove(tag: Tag): void {
    const index = this.tagsFormGroup.controls['tag'].value.indexOf(tag);

    if (index >= 0) {
      this.tagsFormGroup.controls['tag'].value.splice(index, 1);
      this.tagsFormGroup.controls['tag'].updateValueAndValidity();
    }
  }
}
