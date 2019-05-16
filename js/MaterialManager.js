class MaterialManager {
    constructor(parentChart){
        this.parentChart = parentChart;

    }


    // Build an array of materials[count]

    buildMaterials(count) {

        let palette = this.buildPalette();
        let materials = [];

        for (let index = 0; index < count; index++) {
            // let paletteIndex = this.parentChart.remap(index, 0, count, 0, palette.length - 1);
            let paletteIndex = remap(index, 0, count, 0, palette.length - 1);

            let mat = new BABYLON.StandardMaterial("mat" + index, this.parentChart.scene);
            mat.diffuseColor = palette[Math.round(paletteIndex)];
            // mat.sideOrientation = BABYLON.Mesh.DOUBLESIDE;
            if (this.parentChart.options.normal){
                mat.bumpTexture = new BABYLON.Texture("textures/"+this.parentChart.options.normal, this.parentChart.scene);
            }

            if (this.parentChart.options.alpha) {
                mat.alpha = this.parentChart.options.alpha;
            }

            materials.push(mat);
        }

        return materials;
    } //  end buildMaterials method

    buildCustomMaterials() {
        let customMaterials = [];

        for (let index = 0; index < 10; index++) {
            let mat = new BABYLON.StandardMaterial("Custom " + index, this.parentChart.scene);
            mat.sideOrientation = BABYLON.Mesh.DOUBLESIDE;

            customMaterials.push(mat);
        }

        return customMaterials;
    }

    // Build a palette array[1530] of colors

    buildPalette() {

        let palette = [];
        let r = 255,
            g = 0,
            b = 0,
            gray = 0;
        let shade = 1;

        for (let b = 30; b <= 210; b += 30) {
            for (g = 0; g <= 255; g++) {
                addToPalette(r, g, b)
            }
        }
        b = 0;
        g--;

        for (let b = 30; b <= 210; b += 30) {
            for (r = 254; r >= 0; r--) {
                addToPalette(r, g, b)
            }
        }
        b = 0;
        r++;

        for (let r = 30; r <= 210; r += 30) {
            for (b = 1; b <= 255; b++) {
                addToPalette(r, g, b)
            }
        }
        r = 0;
        b--;

        for (let r = 30; r <= 210; r += 30) {
            for (g = 254; g >= 0; g--) {
                addToPalette(r, g, b)
            }
        }
        r = 0;
        g++;

        for (let g = 30; g <= 210; g += 30) {
            for (r = 1; r <= 255; r++) {
                addToPalette(r, g, b)
            }
        }
        g = 0;
        r--;

        for (let g = 30; g <= 210; g += 30) {
            for (b = 254; b > 0; b--) {
                addToPalette(r, g, b)
            }
        }
        g = 0;
        b++;

        for (gray = 254; gray > 0; gray--) {
            addToPalette(gray, gray, gray)
        }
        gray++;

        function addToPalette(r, g, b) {
            palette.push(new BABYLON.Color3((r / 255) * shade, (g / 255) * shade, (b / 255) * shade));
        }

        // console.log('Palette: ');
        // console.log(palette);
        return palette;
    } //  end buildPalette method




}