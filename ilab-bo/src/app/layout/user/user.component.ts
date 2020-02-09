import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/shared/domain/user.model';
import { UserService } from './user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  users: User[];
  constructor(private userService: UserService) { }

  ngOnInit() {
    // this.userService.getAll().subscribe(data => console.log(data));
    this.users = this.userService.getAll()
  }

  deletUser(i) {
    this.users.splice(i, 1)
  }
}
