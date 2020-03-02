interface PersonInterface {
    name: string,
    age: number, 
    eat(): void
}

class xiaoming implements PersonInterface {
    name: string = 'xiaoming';
    age: number = 22;
    eat(){

    }
}

// 数据库访问层代码的
// mysql orcal 
// dbInterface CRUD