import BaseNode from "./base-node";
import FileNode from "./file-node";
import Logger from "../logger";

/**
 * Represents a directory node in a file system.
 */
export default class DirectoryNode extends BaseNode {
    children: Map<string, BaseNode>;

    /**
     * Creates a new DirectoryNode.
     * @param pathName - The name of the directory.
     */
    constructor(pathName: string) {
        super(pathName);
        this.children = new Map();
    }

    /**
     * Retrieves all children of the current directory.
     * @returns An array of child nodes.
     */
    getChildren(): BaseNode[] {
        return Array.from(this.children.values());
    }

    /**
     * Adds a child node to the correct directory.
     * @param child - The node to be added.
     */
    addChild(child: BaseNode) {
        const pathSegments = child.pathName.split("/").filter(Boolean);
        const parent = this.findParentNode(pathSegments);

        if (!parent) {
            Logger.logWarning(`Parent node not found for child ${child.pathName}.`);
            return;
        }

        if (parent.children.has(child.pathName)) {
            Logger.logWarning(`Child with name ${child.pathName} already exists.`);
            return;
        }

        parent.children.set(child.pathName, child);
    }

    /**
     * Removes a child node from the directory.
     * @param pathName - The path of the child node to remove.
     * @returns The removed child node or null if not found.
     */
    removeChild(pathName: string): BaseNode | null {
        const pathSegments = pathName.split("/").filter(Boolean);
        const parent = this.findParentNode(pathSegments);

        if (!parent) {
            Logger.logWarning(`Parent node not found for child ${pathName}.`);
            return null;
        }

        if (!parent.children.has(pathName)) {
            Logger.logWarning(`Child ${pathName} not found.`);
            return null;
        }

        const child = this.children.get(pathName);
        this.children.delete(pathName);
        return child ?? null;
    }

    /**
     * Renames a child node within the directory.
     * @param oldName - The current name of the child node.
     * @param newName - The new name to assign.
     */
    updateChildName(oldName: string, newName: string) {
        if (!this.children.has(oldName)) {
            Logger.logWarning(`Child ${oldName} not found.`);
            return;
        }
        const child = this.removeChild(oldName);

        if (!child) {
            Logger.logWarning(`Child ${oldName} not found.`);
            return;
        }

        child.updateName(newName);
        this.addChild(child);
    }

    /**
     * Updates the content of a file within the directory.
     * @param filePath - The path of the file.
     * @param newContent - The new content for the file.
     */
    updateChildContent(filePath: string, newContent: string) {
        const pathSegments = filePath.split("/").filter(Boolean);
        const node = this.findNode(pathSegments);

        if (node instanceof FileNode) {
            node.updateContent(newContent);
        } else {
            Logger.logWarning(`File ${filePath} not found or is not a FileNode.`);
        }
    }

    /**
     * Prints the directory structure recursively.
     */
    printDirectory() {
        console.log(">" + this.pathName);
        for (const child of this.children.values()) {
            if (child instanceof DirectoryNode) {
                child.printDirectory();
            } else if (child instanceof FileNode) {
                console.log(" " + child.pathName);
            }
        }
    }

    /**
     * Finds a node within the directory structure.
     * @param path - An array representing the path to the node.
     * @returns The found node, or null if not found.
     */
    findNode(path: string[]): BaseNode | null {
        if (path.length === 0) return null;

        const [next, ...rest] = path;
        const child = this.children.get(next);

        if (!child) return null;
        if (child instanceof DirectoryNode && rest.length > 0) {
            return child.findNode(rest);
        }
        return rest.length === 0 && child ? child : null;
    }

    /**
     * Finds the parent directory of a given node.
     * @param path - An array representing the path to the node.
     * @returns The parent directory node, or null if not found.
     */
    findParentNode(path: string[]): DirectoryNode | null {
        if (path.length <= 1) return this;

        const [next, ...rest] = path;
        const child = this.children.get(next);

        if (!child) return null;
        if (child instanceof DirectoryNode && rest.length > 0) {
            return child.findParentNode(rest);
        }
        return rest.length === 0 && child instanceof DirectoryNode ? child : null;
    }
}
