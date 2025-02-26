import BaseNode from "./base-node";

export default class FileNode extends BaseNode {
    content: string;

    constructor(name: string, content: string = "") {
        super(name);
        this.content = content;
    }

    updateContent(newContent: string) {
        this.content = newContent;
    }

    getContent() {
        return this.content;
    }
}
