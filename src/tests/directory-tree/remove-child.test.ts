import DirectoryNode from "../../classes/directory-tree";
import FileNode from "../../classes/directory-tree/file-node";

describe("Removing children from the tree", () => {
    const baseDirectory = new DirectoryNode("");

    beforeAll(() => {
        baseDirectory.addChild(new DirectoryNode("1st_dir"));
        baseDirectory.addChild(new FileNode("1st_file.ts"));
        baseDirectory.addChild(new FileNode("1st_dir/nested_file.py"));
    });

    it("should remove a child from the root directory", () => {
        const child = baseDirectory.removeChild("1st_file.ts")
        expect(child).toBeInstanceOf(FileNode);
        expect(baseDirectory.getChildren()).toHaveLength(1);
    });

    it("should remove a child from a nested directory", () => {
        const child = baseDirectory.removeChild("1st_dir/nested_file.py")
        expect(baseDirectory.getChildren()).toHaveLength(1);
        const nestedDir = baseDirectory.findNode(["1st_dir"]);
        expect(nestedDir).not.toBe(null);
        expect(nestedDir instanceof DirectoryNode).toBeTruthy();
        if (nestedDir instanceof DirectoryNode) {
            expect(nestedDir.getChildren()).toHaveLength(0);
        }
    });

    it("should not remove a child that does not exist", () => {
        const child = baseDirectory.removeChild("dummy_file.ts");
        expect(child).toBe(null);
    });
});
