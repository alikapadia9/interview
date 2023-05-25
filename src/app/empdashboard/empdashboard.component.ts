import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiService } from '../shared/api.service';
import { EmpModel } from './empdashboard.model';

@Component({
  selector: 'app-empdashboard',
  templateUrl: './empdashboard.component.html',
  styleUrls: ['./empdashboard.component.css']
})
export class EmpdashboardComponent implements OnInit {

  formValue !: FormGroup;
  empModelObj: EmpModel = new EmpModel();
  empData !: any;
  showadd !: boolean;
  showupdate !: boolean;

  constructor(private formbuilder: FormBuilder, private api: ApiService) { }
  ngOnInit(): void {
    this.formValue = this.formbuilder.group({
      Name: [''],
      email: [''],
      salary: ['']
    })

    this.getAllEmp();
  }

  clickAddEmp() {
    this.formValue.reset();

    this.showadd = true;

    this.showupdate = false;
  }


  postEmpDetails(): void {
    this.empModelObj.Name = this.formValue.value.Name;
    this.empModelObj.email = this.formValue.value.email;
    this.empModelObj.salary = this.formValue.value.salary;

    this.api.postEmp(this.empModelObj)
      .subscribe(res => {
        console.log(res);
        alert("Emp Added Successfully")
        let ref = document.getElementById('cancel')
        ref?.click();
        this.formValue.reset();
        this.getAllEmp();
      },
        err => {
          alert("something went wrong")
        });
  }

  getAllEmp() {
    this.api.getEmp()
      .subscribe(res => {
        this.empData = res;
      })
  }
  delEmp(row: any) {
    this.api.deleteEmp(row.id)
      .subscribe(res => {
        alert("Emp Deleted Successfully")
        this.getAllEmp();
      })
  }

  onEdit(row: any) {
    this.showadd = false;
    this.showupdate = true;
    this.empModelObj.id = row.id;
    this.formValue.controls['Name'].setValue(row.Name);
    this.formValue.controls['email'].setValue(row.email);
    this.formValue.controls['salary'].setValue(row.salary);
  }
  updateEmpDetails() {
    this.empModelObj.Name = this.formValue.value.Name;
    this.empModelObj.email = this.formValue.value.email;
    this.empModelObj.salary = this.formValue.value.salary;

    this.api.updateEmp(this.empModelObj, this.empModelObj.id)
      .subscribe(res => {
        alert("Emp Updated Successfully")
        let ref = document.getElementById('cancel')
        ref?.click();
        this.formValue.reset();
        this.getAllEmp();
      })
  }
}

