import { _decorator, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

declare const ppttf: any;

globalThis.ppttf ??= {};

const ttf2 = {} as any;
Object.assign(ttf2, ppttf);
ttf2.updateIdx = function (label: Mul) {
    const renderData = label.renderData;
    if (renderData && renderData.chunk) {
        const vData = renderData.chunk.vb;

        const stride = renderData.floatStride;
        const length = renderData.data.length;
        let offset = 0;
        for (let i = 0; i < length; ++i) {
            offset = i * stride;
            vData[offset+2] = label.idx;
        }
        if (label.idx > 0) {
            globalThis.a = vData;
        }
    }

}

ttf2.fillBuffers = function (comp: Label, renderer: any) {
    const renderData = comp.renderData!;
    const chunk = renderData.chunk;
    const dataList: any[] = renderData.data;
    const node = comp.node;

    const vData = chunk.vb;

    // normal version
    const m = node.worldMatrix;
    const stride = renderData.floatStride;
    let offset = 0;
    const length = dataList.length;
    for (let i = 0; i < length; i++) {
        const curData = dataList[i];
        const x = curData.x;
        const y = curData.y;
        let rhw = m.m03 * x + m.m07 * y + m.m15;
        rhw = rhw ? 1 / rhw : 1;

        offset = i * stride;
        vData[offset + 0] = (m.m00 * x + m.m04 * y + m.m12) * rhw;
        vData[offset + 1] = (m.m01 * x + m.m05 * y + m.m13) * rhw;
        // vData[offset + 2] = (m.m02 * x + m.m06 * y + m.m14) * rhw;
    }

    // quick version
    const vid = chunk.vertexOffset;
    const meshBuffer = chunk.meshBuffer;
    const ib = chunk.meshBuffer.iData;
    let indexOffset = meshBuffer.indexOffset;
    ib[indexOffset++] = vid;
    ib[indexOffset++] = vid + 1;
    ib[indexOffset++] = vid + 2;
    ib[indexOffset++] = vid + 2;
    ib[indexOffset++] = vid + 1;
    ib[indexOffset++] = vid + 3;
    meshBuffer.indexOffset += 6;
    // slow version
    // const chunk = renderData.chunk;
    // renderer.getBufferAccessor().appendIndices(chunk);
    globalThis.a = vData
};


@ccclass('Mul')
export class Mul extends Label {
    idx: number = 0;
    public setIdx (i: number) {
        this.idx = i;
        ttf2.updateIdx(this);
    }
    protected _flushAssembler(): void {
        const assembler = ttf2;

        if (this._assembler !== assembler) {
            this.destroyRenderData();
            this._assembler = assembler;
            this._textStyle.reset();
            this._textLayout.reset();
            this._textLayoutData.reset();
            this._textRenderData.reset();
        }

        if (!this.renderData) {
            if (this._assembler && this._assembler.createData) {
                this._renderData = this._assembler.createData(this);
                this.renderData!.material = this.material;
                this._updateColor();
            }
        }
    }
}


