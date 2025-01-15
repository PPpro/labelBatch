import { _decorator, Component, instantiate, Label, Node, SpriteFrame, Texture2D } from 'cc';
import { Mul } from './mul';
const { ccclass, property, executeInEditMode } = _decorator;

function getHash () {
    return 999;
}

@ccclass('NewComponent')
@executeInEditMode
export class NewComponent extends Component {
    @property(Mul)
    l!: Mul;

    @property(Mul)
    l2!: Mul;

    start() {
        this.l.spriteFrame.texture.getHash = getHash;
        this.l2.spriteFrame.texture.getHash = getHash;

        this.l.setIdx(0);
        this.l.updateRenderData();
        this.l.customMaterial.setProperty("tex0", this.l.spriteFrame.texture);

        this.l2.setIdx(1);
        this.l2.updateRenderData();
        this.l2.customMaterial.setProperty("tex1", this.l2.spriteFrame.texture);

        globalThis.a = this.l2.spriteFrame.texture;
    }

    update(deltaTime: number) {
        
    }
}


