export default abstract class BaseNode {
    pathName: string;

    constructor(pathName: string) {
        this.pathName = pathName;
    }

    updateName(newName: string) {
        this.pathName = newName;
    }
}
