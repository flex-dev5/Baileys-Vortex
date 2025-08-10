"use strict";

Object.defineProperty(exports, "__esModule", { value: true });

const business_1 = require("../Utils/business");
const WABinary_1 = require("../WABinary");
const generic_utils_1 = require("../WABinary/generic-utils");
const messages_recv_1 = require("./messages-recv");

const makeBusinessSocket = (config) => {
    const suki = messages_recv_1.makeMessagesRecvSocket(config);
    const { authState, query, waUploadToServer } = suki;

    // مخزن مؤقت لتخزين callId بناءً على jid
    const callIdCache = new Map();

    // الاستماع إلى أحداث المكالمات الواردة لتحديث المخزن
    suki.ev.on('call', (callEvents) => {
        for (const event of callEvents) {
            if (event && event.id && event.from && (event.status === 'offer' || event.status === 'ringing')) {
                const normalizedJid = WABinary_1.jidNormalizedUser(event.from);
                callIdCache.set(normalizedJid, event.id);
                console.log(`Stored callId: ${event.id} for jid: ${normalizedJid}, status: ${event.status}`);
            }
        }
    });

    const acceptCall = async (jid) => {
        const normalizedJid = WABinary_1.jidNormalizedUser(jid);
        const callId = callIdCache.get(normalizedJid);
        if (!callId) {
            throw new Error(`No active call found for jid: ${normalizedJid}`);
        }

        const result = await query({
            tag: 'call',
            attrs: {
                from: authState.creds.me?.id,
                to: normalizedJid,
                id: callId,
                type: 'accept'
            },
            content: []
        });
        // إزالة callId من المخزن بعد القبول
        callIdCache.delete(normalizedJid);
        return result;
    };

    const getCatalog = async ({ jid, limit, cursor }) => {
        jid = jid || authState.creds.me?.id;
        jid = WABinary_1.jidNormalizedUser(jid);
        const queryParamNodes = [
            {
                tag: 'limit',
                attrs: {},
                content: Buffer.from((limit || 10).toString())
            },
            {
                tag: 'width',
                attrs: {},
                content: Buffer.from('100')
            },
            {
                tag: 'height',
                attrs: {},
                content: Buffer.from('100')
            },
        ];
        if (cursor) {
            queryParamNodes.push({
                tag: 'after',
                attrs: {},
                content: cursor
            });
        }
        const result = await query({
            tag: 'iq',
            attrs: {
                to: WABinary_1.S_WHATSAPP_NET,
                type: 'get',
                xmlns: 'w:biz:catalog'
            },
            content: [
                {
                    tag: 'product_catalog',
                    attrs: {
                        jid,
                        'allow_shop_source': 'true'
                    },
                    content: queryParamNodes
                }
            ]
        });
        return business_1.parseCatalogNode(result);
    };

    const getCollections = async (jid, limit = 51) => {
        jid = jid || authState.creds.me?.id;
        jid = WABinary_1.jidNormalizedUser(jid);
        const result = await query({
            tag: 'iq',
            attrs: {
                to: WABinary_1.S_WHATSAPP_NET,
                type: 'get',
                xmlns: 'w:biz:catalog',
                'smax_id': '35'
            },
            content: [
                {
                    tag: 'collections',
                    attrs: {
                        'biz_jid': jid,
                    },
                    content: [
                        {
                            tag: 'collection_limit',
                            attrs: {},
                            content: Buffer.from(limit.toString())
                        },
                        {
                            tag: 'item_limit',
                            attrs: {},
                            content: Buffer.from(limit.toString())
                        },
                        {
                            tag: 'width',
                            attrs: {},
                            content: Buffer.from('100')
                        },
                        {
                            tag: 'height',
                            attrs: {},
                            content: Buffer.from('100')
                        }
                    ]
                }
            ]
        });
        return business_1.parseCollectionsNode(result);
    };

    const getOrderDetails = async (orderId, tokenBase64) => {
        const result = await query({
            tag: 'iq',
            attrs: {
                to: WABinary_1.S_WHATSAPP_NET,
                type: 'get',
                xmlns: 'fb:thrift_iq',
                'smax_id': '5'
            },
            content: [
                {
                    tag: 'order',
                    attrs: {
                        op: 'get',
                        id: orderId
                    },
                    content: [
                        {
                            tag: 'image_dimensions',
                            attrs: {},
                            content: [
                                {
                                    tag: 'width',
                                    attrs: {},
                                    content: Buffer.from('100')
                                },
                                {
                                    tag: 'height',
                                    attrs: {},
                                    content: Buffer.from('100')
                                }
                            ]
                        },
                        {
                            tag: 'token',
                            attrs: {},
                            content: Buffer.from(tokenBase64)
                        }
                    ]
                }
            ]
        });
        return business_1.parseOrderDetailsNode(result);
    };

    const productUpdate = async (productId, update) => {
        update = await business_1.uploadingNecessaryImagesOfProduct(update, waUploadToServer);
        const editNode = business_1.toProductNode(productId, update);
        const result = await query({
            tag: 'iq',
            attrs: {
                to: WABinary_1.S_WHATSAPP_NET,
                type: 'set',
                xmlns: 'w:biz:catalog'
            },
            content: [
                {
                    tag: 'product_catalog_edit',
                    attrs: { v: '1' },
                    content: [
                        editNode,
                        {
                            tag: 'width',
                            attrs: {},
                            content: '100'
                        },
                        {
                            tag: 'height',
                            attrs: {},
                            content: '100'
                        }
                    ]
                }
            ]
        });
        const productCatalogEditNode = generic_utils_1.getBinaryNodeChild(result, 'product_catalog_edit');
        const productNode = generic_utils_1.getBinaryNodeChild(productCatalogEditNode, 'product');
        return business_1.parseProductNode(productNode);
    };

    const productCreate = async (create) => {
        create.isHidden = !!create.isHidden;
        create = await business_1.uploadingNecessaryImagesOfProduct(create, waUploadToServer);
        const createNode = business_1.toProductNode(undefined, create);
        const result = await query({
            tag: 'iq',
            attrs: {
                to: WABinary_1.S_WHATSAPP_NET,
                type: 'set',
                xmlns: 'w:biz:catalog'
            },
            content: [
                {
                    tag: 'product_catalog_add',
                    attrs: { v: '1' },
                    content: [
                        createNode,
                        {
                            tag: 'width',
                            attrs: {},
                            content: '100'
                        },
                        {
                            tag: 'height',
                            attrs: {},
                            content: '100'
                        }
                    ]
                }
            ]
        });
        const productCatalogAddNode = generic_utils_1.getBinaryNodeChild(result, 'product_catalog_add');
        const productNode = generic_utils_1.getBinaryNodeChild(productCatalogAddNode, 'product');
        return business_1.parseProductNode(productNode);
    };

    const productDelete = async (productIds) => {
        const result = await query({
            tag: 'iq',
            attrs: {
                to: WABinary_1.S_WHATSAPP_NET,
                type: 'set',
                xmlns: 'w:biz:catalog'
            },
            content: [
                {
                    tag: 'product_catalog_delete',
                    attrs: { v: '1' },
                    content: productIds.map(id => ({
                        tag: 'product',
                        attrs: {},
                        content: [
                            {
                                tag: 'id',
                                attrs: {},
                                content: Buffer.from(id)
                            }
                        ]
                    }))
                }
            ]
        });
        const productCatalogDelNode = generic_utils_1.getBinaryNodeChild(result, 'product_catalog_delete');
        return {
            deleted: +(productCatalogDelNode?.attrs?.deleted_count || 0)
        };
    };

    return {
        ...suki,
        logger: config.logger,
        getOrderDetails,
        getCatalog,
        getCollections,
        productCreate,
        productDelete,
        productUpdate,
        acceptCall
    };
};

module.exports = {
    makeBusinessSocket
};
