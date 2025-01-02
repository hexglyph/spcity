import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { GridCell, WordList, generateUniqueCellName } from '@/models/GridCell'

const wordList: WordList = {
    portuguese: [
        'alfa', 'alvo', 'amarelo', 'amor', 'arco', 'aroma', 'azul', 'balde', 'banana',
        'banda', 'barriga', 'batata', 'beijo', 'bloco', 'boca', 'bolo', 'brasil',
        'broca', 'caneta', 'carro', 'casa', 'cauda', 'cebola', 'cenoura', 'chave',
        'circo', 'cobre', 'colher', 'comida', 'copo', 'corda', 'dado', 'dedo', 'delta',
        'dentro', 'dia', 'digital', 'dois', 'escada', 'escudo', 'espada', 'faca', 'farol',
        'ferro', 'fogo', 'folha', 'fora', 'foto', 'fruta', 'futuro', 'garfo', 'gelo',
        'hoje', 'hora', 'imagem', 'infinito', 'lago', 'luva', 'manteiga', 'mar', 'marte',
        'medo', 'mel', 'minuto', 'moda', 'moto', 'nariz', 'neve', 'noite', 'olho',
        'ombro', 'omega', 'ordem', 'orelha', 'osso', 'ouro', 'oval', 'ovo', 'palito',
        'parque', 'pastel', 'perna', 'piso', 'pizza', 'porto', 'prata', 'prato', 'prego',
        'rio', 'roda', 'rolo', 'roma', 'sapato', 'selo', 'sol', 'som', 'soma', 'sono',
        'tambor', 'tampa', 'tapete', 'teclado', 'telha', 'tempo', 'terra', 'tinta',
        'torta', 'traje', 'um', 'valor', 'verde', 'vermelho', 'verso', 'vida'
    ],
    english: [
        'alpha', 'target', 'yellow', 'love', 'arc', 'aroma', 'blue', 'bucket', 'banana',
        'band', 'stomach', 'potato', 'kiss', 'block', 'mouth', 'cake', 'brazil',
        'drill', 'pen', 'car', 'home', 'tail', 'onion', 'carrot', 'key', 'circus',
        'copper', 'spoon', 'food', 'glass', 'rope', 'dice', 'finger', 'delta',
        'inside', 'day', 'digital', 'two', 'stairs', 'shield', 'sword', 'knife', 'lighthouse',
        'iron', 'fire', 'leaf', 'outside', 'photograph', 'fruit', 'future', 'fork', 'ice',
        'today', 'hour', 'image', 'infinite', 'lake', 'glove', 'butter', 'sea', 'mars',
        'fear', 'honey', 'minute', 'fashion', 'bike', 'nose', 'snow', 'night', 'eye',
        'shoulder', 'omega', 'order', 'ear', 'bone', 'gold', 'oval', 'egg', 'toothpick',
        'park', 'pastry', 'leg', 'floor', 'pizza', 'harbor', 'silver', 'dish', 'nail',
        'river', 'wheel', 'roll', 'pomegranate', 'shoe', 'seal', 'sun', 'sound', 'sum', 'sleep',
        'drum', 'cover', 'mat', 'keyboard', 'tile', 'time', 'earth', 'ink',
        'pie', 'costume', 'one', 'value', 'green', 'red', 'verse', 'life'
    ],
    japanese: [
        'アルファ', '目標', '黄色', '愛', 'アーク', '香り', '青', 'バケツ', 'バナナ',
        'バンド', '胃', 'じゃがいも', '接吻', 'ブロック', '口', 'ケーキ', 'ブラジル',
        'ドリル', 'ペン', '車両', '家', 'しっぽ', '玉ねぎ', 'にんじん', '鍵', 'サーカス',
        '銅', 'スプーン', '食物', 'ガラス', 'ロープ', 'サイコロ', '指', 'デルタ',
        '中身', '日', 'デジタル', 'ニ', '階段', 'シールド', '剣', 'ナイフ', '灯台',
        '鉄', '火', '葉', '外側', '写真', 'フルーツ', '将来', 'フォーク', '氷',
        '今日', '時間', '画像', '無限', '湖', 'グローブ', 'バター', '海', '火星',
        '恐れ', '蜂蜜', '分', 'ファッション', '自転車', '鼻', '雪', '夜', '目',
        'ショルダー', 'オメガ', '注文', '耳', '骨', 'ゴールド', '楕円形', '卵', '爪楊枝',
        '公園', 'ペストリー', '足', '床', 'ピザ', '港', '銀', '皿', 'ネイル',
        '川', '車輪', 'ロール', 'ザクロ', '靴', '密閉する', '太陽', '音', '和', '睡眠',
        'ドラム', 'カバー', 'マット', 'キーボード', 'タイル', '時間', '地球', 'インク',
        'パイ', 'コスチューム', '一', '価値', '緑', '赤', '詩', '生活'
    ],
    spanish: [
        'alfa', 'objetivo', 'amarillo', 'amar', 'arco', 'aroma', 'azul', 'cubeta', 'plátano',
        'banda', 'estómago', 'papa', 'beso', 'cuadra', 'boca', 'pastel', 'brasil',
        'perforar', 'bolígrafo', 'coche', 'casa', 'cola', 'cebolla', 'zanahoria', 'llave', 'circo',
        'cobre', 'cuchara', 'alimento', 'copa', 'soga', 'dado', 'dedo', 'delta',
        'interior', 'día', 'digital', 'dos', 'escalera', 'escudo', 'espada', 'cuchillo', 'faro',
        'planchar', 'fuego', 'lámina', 'fuera', 'fotografía', 'fruta', 'futuro', 'tenedor', 'hielo',
        'hoy', 'hora', 'imagen', 'infinito', 'lago', 'guante', 'manteca', 'mar', 'marte',
        'miedo', 'miel', 'minuto', 'moda', 'bicicleta', 'nariz', 'nieve', 'noche', 'ojo',
        'hombro', 'omega', 'pedido', 'oído', 'hueso', 'oro', 'oval', 'huevo', 'palillo',
        'parque', 'masa', 'pierna', 'piso', 'pizza', 'puerto', 'plata', 'plato', 'clavo',
        'río', 'rueda', 'rodar', 'granada', 'zapato', 'sello', 'sol', 'sonar', 'suma', 'dormir',
        'tambor', 'cubrir', 'estera', 'teclado', 'teja', 'tiempo', 'tierra', 'tinta',
        'tarta', 'traje', 'uno', 'valor', 'verde', 'rojo', 'verso', 'vida'
    ]
};


export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const cellNumber = searchParams.get('cellNumber')
    const lat = searchParams.get('lat')
    const lng = searchParams.get('lng')

    if (!cellNumber) {
        return NextResponse.json({ error: 'Cell number is required' }, { status: 400 })
    }

    try {
        const client = await clientPromise
        const db = client.db('spcity')
        const collection = db.collection<GridCell>('gridcells')

        const cell = await collection.findOne({ cellNumber: parseInt(cellNumber) })

        if (cell) {
            return NextResponse.json(cell)
        }

        if (!lat || !lng) {
            return NextResponse.json({ error: 'Cell not found and lat/lng not provided for creation' }, { status: 404 })
        }

        // If we reach here, the cell doesn't exist and we have lat/lng to create it
        const allCells = await collection.find().toArray()
        const usedNames = new Set<string>(
            allCells
                .filter(cell => cell.names && cell.names.portuguese)
                .map(cell => cell.names.portuguese)
        )

        const names = generateUniqueCellName(wordList, usedNames)
        if (!names) {
            return NextResponse.json({ error: 'Could not generate unique cell name' }, { status: 500 })
        }

        const latNum = parseFloat(lat)
        const lngNum = parseFloat(lng)
        const gridSizeInDegrees = 5 / 111000 // 5 meters in degrees

        const newCell: GridCell = {
            cellNumber: parseInt(cellNumber),
            coordinates: {
                latRange: [latNum, latNum + gridSizeInDegrees],
                lngRange: [lngNum, lngNum + gridSizeInDegrees]
            },
            names,
            data: {}
        }

        await collection.insertOne(newCell)
        return NextResponse.json(newCell)
    } catch (error) {
        console.error('Error fetching or creating cell data:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}