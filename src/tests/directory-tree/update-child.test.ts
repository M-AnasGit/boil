import DirectoryNode from "../../classes/directory-tree";
import FileNode from "../../classes/directory-tree/file-node";

describe("Updating a child in the tree", () => {
    const baseDirectory = new DirectoryNode("");

    const newContent = `console.log("new file")`
    const newFileName = "1st_file_updated.ts"

    const nestedNewContent = `print("new content")`
    const nestedNewFileName = "1st_dir/nested_file_updated.py"
    beforeAll(() => {
        baseDirectory.addChild(new DirectoryNode("1st_dir"));
        baseDirectory.addChild(new FileNode("1st_file.ts"));
        baseDirectory.addChild(new FileNode("1st_dir/nested_file.py"));
    });

    it("should update a child's name in the root directory", () => {
        baseDirectory.updateChildName("1st_file.ts", newFileName)
        expect(baseDirectory.getChildren()).toHaveLength(2);
        expect(baseDirectory.children.get("1st_file.ts")).toBe(undefined);
        expect(baseDirectory.children.get("1st_file_updated.ts")).toBeTruthy();
    });

    it("should update a child's name in the root directory", () => {
        baseDirectory.updateChildContent(newFileName, newContent)
        const child = baseDirectory.children.get("1st_file_updated.ts");
        expect(child).toBeTruthy();
        expect(child instanceof FileNode).toBeTruthy();

        if(child instanceof FileNode) {
            expect(child.getContent()).toBe(newContent);
        }
    });


    it("should update a child's name in a nested directory", () => {
        baseDirectory.updateChildName("1st_dir/nested_file.py", nestedNewFileName);
        const nestedDir = baseDirectory.findNode(["1st_dir"]);
        expect(nestedDir).not.toBe(null);
        expect(nestedDir instanceof DirectoryNode).toBeTruthy();
        if (nestedDir instanceof DirectoryNode) {
            expect(nestedDir.children.get("nested_file.py")).toBe(undefined);
            expect(nestedDir.children.get(nestedNewFileName.split("/")[1])).toBeTruthy();
        }
    });

    it("should update a child's content in a nested directory", () => {
        baseDirectory.updateChildContent(nestedNewFileName, nestedNewContent);
        const nestedDir = baseDirectory.findNode(["1st_dir"]);
        expect(nestedDir).not.toBe(null);
        expect(nestedDir instanceof DirectoryNode).toBeTruthy();
        if (nestedDir instanceof DirectoryNode) {
            const child = nestedDir.children.get(nestedNewFileName.split("/")[1])
            expect(child).toBeTruthy();
            expect(child instanceof FileNode).toBeTruthy();
            if(child instanceof FileNode) {
                expect(child.getContent()).toBe(nestedNewContent);
            }
        }
    });


    it("should not update a child that does not exist", () => {
        baseDirectory.updateChildName("dummy.py", "dummy.ts");
        expect(baseDirectory.getChildren()).toHaveLength(2);
        baseDirectory.updateChildContent("dummy.py", "dummy content")
        expect(baseDirectory.getChildren()).toHaveLength(2);
    });
});
