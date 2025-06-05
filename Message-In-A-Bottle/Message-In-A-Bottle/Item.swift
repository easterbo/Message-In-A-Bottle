//
//  Item.swift
//  Message-In-A-Bottle
//
//  Created by Ollie Easterbrook on 05/06/2025.
//

import Foundation
import SwiftData

@Model
final class Item {
    var timestamp: Date
    
    init(timestamp: Date) {
        self.timestamp = timestamp
    }
}
