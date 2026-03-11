const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User'); // Import for association

const Clip = sequelize.define('Clip', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    code: {
        type: DataTypes.STRING(4),
        allowNull: false,
        unique: true,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: true,
    },
}, {
    timestamps: true,
});

// Associations
User.hasMany(Clip, { foreignKey: 'userId', onDelete: 'CASCADE' });
Clip.belongsTo(User, { foreignKey: 'userId' });

module.exports = Clip;
