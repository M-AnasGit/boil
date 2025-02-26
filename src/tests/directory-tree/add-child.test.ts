import DirectoryNode from "../../classes/directory-tree";
import FileNode from "../../classes/directory-tree/file-node";

describe("Adding child to the tree", () => {
    const baseDirectory = new DirectoryNode("");

    beforeAll(() => {
        baseDirectory.addChild(new DirectoryNode("1st_dir"));
        baseDirectory.addChild(new FileNode("1st_file.ts"));
        baseDirectory.addChild(new FileNode("1st_dir/nested_file.py"));
    });

    it("should return the correct number of children", () => {
        expect(baseDirectory.getChildren()).toHaveLength(2);
    });

    it("should add a child to the root directory", () => {
        baseDirectory.addChild(new DirectoryNode("2nd_dir"));
        expect(baseDirectory.getChildren()).toHaveLength(3);
    });

    it("should add a child to a nested directory", () => {
        baseDirectory.addChild(new FileNode("2nd_dir/nested_file.py"));
        expect(baseDirectory.getChildren()).toHaveLength(3);
        const nestedDir = baseDirectory.findNode(["2nd_dir"]);
        expect(nestedDir).not.toBe(null);
        expect(nestedDir instanceof DirectoryNode).toBeTruthy();
        if (nestedDir instanceof DirectoryNode) {
            expect(nestedDir.getChildren()).toHaveLength(1);
        }
    });

    it("should not add a child to a non-existent directory", () => {
        baseDirectory.addChild(new FileNode("3rd_dir/nested_file.py"));
        expect(baseDirectory.findNode(["3rd_dir", "nested_file.py"])).toBe(null);
    });

    it("should not add a child that already exists", () => {
        baseDirectory.addChild(new FileNode("1st_file.ts"));
        expect(baseDirectory.getChildren()).toHaveLength(3);
    });
});
