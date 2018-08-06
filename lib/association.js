"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.associations = [
    'NONE',
    'FIRST_TIMER',
    'FIRST_TIME_CONTRIBUTOR',
    'CONTRIBUTOR',
    'COLLABORATOR',
    'MEMBER',
    'OWNER'
];
function getAssociationPriority(association) {
    // Note: this will return -1 for any association that is not found.
    // This will prioritise unknown associations lowest.
    return exports.associations.indexOf(association);
}
exports.getAssociationPriority = getAssociationPriority;
//# sourceMappingURL=association.js.map