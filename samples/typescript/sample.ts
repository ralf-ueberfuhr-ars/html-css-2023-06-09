let text: string = '';

function parseNumber(nr: string): number {
    return 4;//Number.parseFloat(nr);
}

type Config = {
    name: string,
    count: number
};

function doSth(config: Config): void {

}

doSth({
    count: 4,
    name: 'test'
});

function doSth2(config: { age: number, name: string }): void {

}
doSth2({
    age: 19,
    name: 'test'
})

class Person {

    constructor(public name: string, public age: number = 18) {

    }

    sayHello(): void {
        console.log(`Hallo, ich bin ${this.name}`);
    }

}

let p: Person;
p = new Person('Tom', 20);
console.log(p.age);
p.sayHello();